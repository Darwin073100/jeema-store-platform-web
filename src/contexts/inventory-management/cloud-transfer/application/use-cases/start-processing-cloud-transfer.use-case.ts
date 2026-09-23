import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * B inicia el procesamiento del traspaso entrante (PENDING -> IN_TRANSIT) y ejecuta el auto-match por
 * código de barras sobre las líneas que aún estén PENDING. Ver spect/08_cloud_transfer_spect.md sección
 * 5.5, incluida la nota sobre por qué los métodos `*Transactional` resuelven el manager dentro del método.
 */
export class StartProcessingCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly productRepository: ProductRepository,
        private readonly inventoryRepository: InventoryRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly employeeRepository: EmployeeRepository,
    ) { }

    async execute(localCloudTransferId: bigint, actingEmployeeId: bigint): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }
        if (header.direction !== CloudTransferDirectionEnum.INCOMING || !header.toBranchOfficeId) {
            throw new InvalidCloudTransferException('Solo la sucursal destino (B) puede iniciar el procesamiento de un traspaso entrante.');
        }
        if (!header.remoteCloudTransferId) {
            throw new InvalidCloudTransferException('El traspaso todavía no tiene un id remoto asignado por la nube.');
        }

        const employeeExists = await this.employeeRepository.existById(actingEmployeeId);
        if (!employeeExists) {
            throw new InvalidCloudTransferException(`El empleado (${actingEmployeeId}) no existe.`);
        }

        const branch = await this.branchOfficeRepository.findById(header.toBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal destino no existe o no está inscrita en la nube.');
        }

        const apiResult = await this.cloudTransferApiRepository.startProcessing(header.remoteCloudTransferId, branch.cloudBranchOfficeId);
        if (!apiResult.ok) {
            return Result.failure(apiResult.error as ErrorEntity);
        }

        // La entidad valida la transición. Caso normal: PENDING -> IN_TRANSIT (lanza si ya no está PENDING,
        // evitando doble-click). Caso retry (gap corregido aquí, ver spect/09_..._spect.md): si B ya reportó
        // error (`errorCloudTransferAction`, status ERROR) y quiere reintentar el procesamiento, este mismo
        // caso de uso se reinvoca desde la UI — se usa `retryProcessing()` (ERROR -> IN_TRANSIT), que ya
        // existía en la entidad pero ningún caso de uso la invocaba todavía.
        if (header.status === CloudTransferStatusEnum.ERROR) {
            header.retryProcessing();
        } else {
            header.startProcessing(actingEmployeeId);
        }
        await this.cloudTransferRepository.save(header);

        for (const item of header.items) {
            if (item.resolutionStatus !== CloudTransferItemResolutionStatusEnum.PENDING) continue;
            if (!item.productUniversalBarCode) continue; // nunca hay auto-match sin barcode

            const candidate = await this.productRepository.findByEstablishmentAndUniversalBarCode(
                branch.establishmentId,
                item.productUniversalBarCode,
            );
            if (!candidate) continue; // queda PENDING, requiere resolución humana

            const candidateInventories = await this.inventoryRepository.findAllByProductId(candidate.productId);
            const inventoryMatch = candidateInventories.find(inv => inv.branchOfficeId === branch.branchOfficeId);

            item.autoMatchByBarcode(candidate.productId, inventoryMatch?.inventoryId ?? null);
            await this.cloudTransferItemRepository.save(item);
        }

        const refreshed = await this.cloudTransferRepository.findById(localCloudTransferId);
        return Result.success(refreshed as CloudTransferEntity);
    }
}
