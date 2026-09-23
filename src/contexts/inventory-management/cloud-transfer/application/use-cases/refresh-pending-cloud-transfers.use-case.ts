import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { CloudTransferApiMapper } from "../../infraestructure/http/mappers/cloud-transfer-api.mapper";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { ICloudTransferApiResponse } from "../dtos/cloud-transfer-api-response.dto";

/**
 * B ejecuta `GET pending/:toCloudBranchId` y sincroniza los traspasos entrantes al espejo local. Ver
 * spect/08_cloud_transfer_spect.md sección 5.4.
 */
export class RefreshPendingCloudTransfersUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
    ) { }

    async execute(localBranchOfficeId: bigint): Promise<Result<CloudTransferEntity[], ErrorEntity>> {
        const branch = await this.branchOfficeRepository.findById(localBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal no existe o no está inscrita en la nube.');
        }

        const result = await this.cloudTransferApiRepository.findPendingByToCloudBranchId(branch.cloudBranchOfficeId);
        if (!result.ok) {
            return Result.failure(result.error as ErrorEntity);
        }

        for (const remote of result.value ?? []) {
            await this.upsertMirror(remote, localBranchOfficeId);
        }

        const list = await this.cloudTransferRepository.findAllByBranchOffice(localBranchOfficeId, CloudTransferDirectionEnum.INCOMING);
        return Result.success(list);
    }

    private async upsertMirror(remote: ICloudTransferApiResponse, localBranchOfficeId: bigint): Promise<void> {
        const remoteCloudTransferId = BigInt(remote.cloudTransferId);
        // Escopado por INCOMING: si A y B comparten base de datos, A ya tiene su propia fila OUTGOING con
        // este mismo remoteCloudTransferId — sin este filtro, `existing` la encontraría por accidente y B
        // nunca crearía (ni actualizaría) su propio espejo entrante.
        const existing = await this.cloudTransferRepository.findByRemoteCloudTransferId(remoteCloudTransferId, CloudTransferDirectionEnum.INCOMING);
        const freshStatus = CloudTransferApiMapper.toDomainStatus(remote.status);

        if (!existing) {
            const items = CloudTransferApiMapper.toDomainItems(remote, BigInt(0));
            const mirror = CloudTransferEntity.fromCloudSnapshot(
                remoteCloudTransferId,
                BigInt(remote.fromCloudBranchId),
                BigInt(remote.toCloudBranchId),
                localBranchOfficeId,
                freshStatus,
                remote.payload.shipmentNotes ?? null,
                items,
            );
            await this.cloudTransferRepository.save(mirror);
            return;
        }

        // Ya existe el espejo local: solo refrescamos status y marcamos sincronizado. Los items locales NO
        // se sobrescriben con el eco de la nube — cargan el estado de resolución de B, que la nube no
        // conoce ni devuelve.
        const refreshed = CloudTransferEntity.reconstitute({
            cloudTransferId: existing.cloudTransferId,
            remoteCloudTransferId: existing.remoteCloudTransferId,
            direction: existing.direction,
            fromBranchOfficeId: existing.fromBranchOfficeId,
            fromCloudBranchOfficeId: existing.fromCloudBranchOfficeId,
            toBranchOfficeId: existing.toBranchOfficeId,
            toCloudBranchOfficeId: existing.toCloudBranchOfficeId,
            status: freshStatus,
            shipmentNotes: existing.shipmentNotes,
            resolutionNotes: existing.resolutionNotes,
            errorMessage: existing.errorMessage,
            requestedByEmployeeId: existing.requestedByEmployeeId,
            processedByEmployeeId: existing.processedByEmployeeId,
            lastSyncedAt: existing.lastSyncedAt,
            createdAt: existing.createdAt,
            updatedAt: existing.updatedAt,
            items: existing.items,
        });
        refreshed.markSynced();
        await this.cloudTransferRepository.save(refreshed);
    }
}
