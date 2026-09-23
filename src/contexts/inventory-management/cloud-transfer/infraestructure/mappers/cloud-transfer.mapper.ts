import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferOrmEntity } from "../entities/cloud-transfer.orm-entity";
import { CloudTransferItemMapper } from "./cloud-transfer-item.mapper";

export class CloudTransferMapper {
    static toDomain(ormEntity: CloudTransferOrmEntity): CloudTransferEntity {
        return CloudTransferEntity.reconstitute({
            cloudTransferId: ormEntity.cloudTransferId,
            remoteCloudTransferId: ormEntity.remoteCloudTransferId,
            direction: ormEntity.direction,
            fromBranchOfficeId: ormEntity.fromBranchOfficeId,
            fromCloudBranchOfficeId: ormEntity.fromCloudBranchOfficeId,
            toBranchOfficeId: ormEntity.toBranchOfficeId,
            toCloudBranchOfficeId: ormEntity.toCloudBranchOfficeId,
            status: ormEntity.status,
            shipmentNotes: ormEntity.shipmentNotes,
            resolutionNotes: ormEntity.resolutionNotes,
            errorMessage: ormEntity.errorMessage,
            requestedByEmployeeId: ormEntity.requestedByEmployeeId,
            processedByEmployeeId: ormEntity.processedByEmployeeId,
            lastSyncedAt: ormEntity.lastSyncedAt,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            items: (ormEntity.items ?? []).map(item => CloudTransferItemMapper.toDomain(item)),
        });
    }

    static toOrmEntity(domainEntity: CloudTransferEntity): CloudTransferOrmEntity {
        const ormEntity = new CloudTransferOrmEntity();
        ormEntity.cloudTransferId = domainEntity.cloudTransferId;
        ormEntity.remoteCloudTransferId = domainEntity.remoteCloudTransferId;
        ormEntity.direction = domainEntity.direction;
        ormEntity.fromBranchOfficeId = domainEntity.fromBranchOfficeId;
        ormEntity.fromCloudBranchOfficeId = domainEntity.fromCloudBranchOfficeId;
        ormEntity.toBranchOfficeId = domainEntity.toBranchOfficeId;
        ormEntity.toCloudBranchOfficeId = domainEntity.toCloudBranchOfficeId;
        ormEntity.status = domainEntity.status;
        ormEntity.shipmentNotes = domainEntity.shipmentNotes;
        ormEntity.resolutionNotes = domainEntity.resolutionNotes;
        ormEntity.errorMessage = domainEntity.errorMessage;
        ormEntity.requestedByEmployeeId = domainEntity.requestedByEmployeeId;
        ormEntity.processedByEmployeeId = domainEntity.processedByEmployeeId;
        ormEntity.lastSyncedAt = domainEntity.lastSyncedAt;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.items = domainEntity.items.map(item => CloudTransferItemMapper.toOrmEntity(item));
        return ormEntity;
    }
}
