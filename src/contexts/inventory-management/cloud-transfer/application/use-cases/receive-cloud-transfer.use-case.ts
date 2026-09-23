import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * Confirmación física de recepción. Sin mutación de inventario (así lo especifica la API: "inventory NOT
 * yet touched"). Ver spect/08_cloud_transfer_spect.md sección 5.6.
 */
export class ReceiveCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly employeeRepository: EmployeeRepository,
    ) { }

    async execute(localCloudTransferId: bigint, actingEmployeeId: bigint, notes?: string | null): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }
        if (header.direction !== CloudTransferDirectionEnum.INCOMING || !header.toBranchOfficeId || !header.remoteCloudTransferId) {
            throw new InvalidCloudTransferException('Solo la sucursal destino (B) puede recibir un traspaso entrante ya enviado a la nube.');
        }

        const employeeExists = await this.employeeRepository.existById(actingEmployeeId);
        if (!employeeExists) {
            throw new InvalidCloudTransferException(`El empleado (${actingEmployeeId}) no existe.`);
        }

        const branch = await this.branchOfficeRepository.findById(header.toBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal destino no existe o no está inscrita en la nube.');
        }

        const apiResult = await this.cloudTransferApiRepository.receive(header.remoteCloudTransferId, branch.cloudBranchOfficeId, notes ?? undefined);
        if (!apiResult.ok) {
            return Result.failure(apiResult.error as ErrorEntity);
        }

        header.receive(actingEmployeeId, notes ?? null);
        const saved = await this.cloudTransferRepository.save(header);
        return Result.success(saved);
    }
}
