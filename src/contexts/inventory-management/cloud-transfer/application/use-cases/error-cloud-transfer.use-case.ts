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
 * Simétrico a `ReceiveCloudTransferUseCase`: llama al endpoint `error`, y solo si tiene éxito invoca
 * `header.markError(errorMessage)` y guarda. Puede ser reportado por A o por B (la sucursal local que
 * corresponda a esta instalación según `direction`). Ver spect/08_cloud_transfer_spect.md sección 5.8.
 */
export class ErrorCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
    ) { }

    async execute(localCloudTransferId: bigint, errorMessage: string): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }
        if (!header.remoteCloudTransferId) {
            throw new InvalidCloudTransferException('El traspaso todavía no tiene un id remoto asignado por la nube.');
        }

        const localBranchOfficeId = header.direction === CloudTransferDirectionEnum.OUTGOING
            ? header.fromBranchOfficeId
            : header.toBranchOfficeId;
        if (!localBranchOfficeId) {
            throw new InvalidCloudTransferException('No se pudo determinar la sucursal local que reporta el error.');
        }
        const branch = await this.branchOfficeRepository.findById(localBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal local no existe o no está inscrita en la nube.');
        }

        const apiResult = await this.cloudTransferApiRepository.reportError(header.remoteCloudTransferId, branch.cloudBranchOfficeId, errorMessage);
        if (!apiResult.ok) {
            return Result.failure(apiResult.error as ErrorEntity);
        }

        header.markError(errorMessage);
        const saved = await this.cloudTransferRepository.save(header);
        return Result.success(saved);
    }
}
