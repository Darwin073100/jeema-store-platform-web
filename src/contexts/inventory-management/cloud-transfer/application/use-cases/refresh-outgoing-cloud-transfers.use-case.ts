import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { CloudTransferApiMapper } from "../../infraestructure/http/mappers/cloud-transfer-api.mapper";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

const TERMINAL_STATUSES: CloudTransferStatusEnum[] = [CloudTransferStatusEnum.APPROVED, CloudTransferStatusEnum.CANCELLED];

/**
 * Análogo saliente de `RefreshPendingCloudTransfersUseCase`: A no tiene forma de enterarse de que B ya
 * procesó/aprobó un traspaso que envió, porque `receive()`/`approve()` solo mutan la fila local del lado
 * que ejecuta la acción (la INCOMING de B). Este caso de uso hace `GET /cloud-transfers/:id` (vía
 * `RefreshCloudTransferFromCloudUseCase`-equivalente inline) por cada OUTGOING ya enviado y aún no resuelto,
 * para que el espejo local de A refleje el estado real. Best-effort: un traspaso inalcanzable no bloquea el
 * refresco del resto.
 */
export class RefreshOutgoingCloudTransfersUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
    ) { }

    async execute(localBranchOfficeId: bigint): Promise<Result<CloudTransferEntity[], ErrorEntity>> {
        const outgoing = await this.cloudTransferRepository.findAllByBranchOffice(localBranchOfficeId, CloudTransferDirectionEnum.OUTGOING);
        const refreshable = outgoing.filter(t => t.remoteCloudTransferId !== null && !TERMINAL_STATUSES.includes(t.status));

        for (const header of refreshable) {
            await this.refreshOne(header);
        }

        const list = await this.cloudTransferRepository.findAllByBranchOffice(localBranchOfficeId, CloudTransferDirectionEnum.OUTGOING);
        return Result.success(list);
    }

    private async refreshOne(header: CloudTransferEntity): Promise<void> {
        const result = await this.cloudTransferApiRepository.findById(header.remoteCloudTransferId!);
        if (!result.ok) {
            // Best-effort: no interrumpe el refresco de los demás traspasos de la sucursal.
            return;
        }

        const freshStatus = CloudTransferApiMapper.toDomainStatus(result.value!.status);
        if (freshStatus === header.status) {
            return;
        }

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
        await this.cloudTransferRepository.save(refreshed);
    }
}
