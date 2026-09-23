import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * Simétrico a `ReceiveCloudTransferUseCase`. Puede darse hasta RECEIVED (antes de que exista cualquier
 * stock creado, ya que la mutación real ocurre en `ApproveCloudTransferUseCase`). Sin mutación de
 * inventario. Ver spect/08_cloud_transfer_spect.md sección 5.8.
 */
export class CancelCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
    ) { }

    async execute(localCloudTransferId: bigint, reason?: string | null): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }

        const localBranchOfficeId = header.direction === CloudTransferDirectionEnum.OUTGOING
            ? header.fromBranchOfficeId
            : header.toBranchOfficeId;
        if (!localBranchOfficeId) {
            throw new InvalidCloudTransferException('No se pudo determinar la sucursal local que cancela el traspaso.');
        }
        const branch = await this.branchOfficeRepository.findById(localBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal local no existe o no está inscrita en la nube.');
        }

        if (!header.remoteCloudTransferId) {
            // Nunca se envió a la nube; cancelar es puramente local.
            header.cancel(reason ?? null);
            const saved = await this.cloudTransferRepository.save(header);
            return Result.success(saved);
        }

        const apiResult = await this.cloudTransferApiRepository.cancel(header.remoteCloudTransferId, branch.cloudBranchOfficeId, reason ?? undefined);
        if (!apiResult.ok) {
            return Result.failure(apiResult.error as ErrorEntity);
        }

        header.cancel(reason ?? null);
        const saved = await this.cloudTransferRepository.save(header);
        return Result.success(saved);
    }
}
