import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { CloudTransferApiMapper } from "../../infraestructure/http/mappers/cloud-transfer-api.mapper";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * `GET /cloud-transfers/:id`, resincroniza el espejo local (status únicamente; los items locales conservan
 * su estado de resolución, que la nube no conoce). Listado en spect/08_cloud_transfer_spect.md sección 3.1,
 * no detallado con pseudocódigo propio en sección 5 — implementado siguiendo el mismo patrón de
 * `RefreshPendingCloudTransfersUseCase`.
 */
export class RefreshCloudTransferFromCloudUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
    ) { }

    async execute(localCloudTransferId: bigint): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }
        if (!header.remoteCloudTransferId) {
            // Todavía no se envió a la nube; no hay nada que resincronizar.
            return Result.success(header);
        }

        const result = await this.cloudTransferApiRepository.findById(header.remoteCloudTransferId);
        if (!result.ok) {
            return Result.failure(result.error as ErrorEntity);
        }

        const freshStatus = CloudTransferApiMapper.toDomainStatus(result.value!.status);
        const refreshed = CloudTransferEntity.reconstitute({
            cloudTransferId: header.cloudTransferId,
            remoteCloudTransferId: header.remoteCloudTransferId,
            direction: header.direction,
            fromBranchOfficeId: header.fromBranchOfficeId,
            fromCloudBranchOfficeId: header.fromCloudBranchOfficeId,
            toBranchOfficeId: header.toBranchOfficeId,
            toCloudBranchOfficeId: header.toCloudBranchOfficeId,
            status: freshStatus,
            shipmentNotes: header.shipmentNotes,
            resolutionNotes: header.resolutionNotes,
            errorMessage: header.errorMessage,
            requestedByEmployeeId: header.requestedByEmployeeId,
            processedByEmployeeId: header.processedByEmployeeId,
            lastSyncedAt: header.lastSyncedAt,
            createdAt: header.createdAt,
            updatedAt: header.updatedAt,
            items: header.items,
        });
        refreshed.markSynced();
        const saved = await this.cloudTransferRepository.save(refreshed);
        return Result.success(saved);
    }
}
