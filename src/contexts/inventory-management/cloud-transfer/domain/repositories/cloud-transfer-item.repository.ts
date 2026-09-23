import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CloudTransferItemEntity } from "../entities/cloud-transfer-item.entity";

export const CLOUD_TRANSFER_ITEM_REPOSITORY = Symbol('CLOUD_TRANSFER_ITEM_REPOSITORY');

export interface CloudTransferItemRepository extends TemplateRepository<CloudTransferItemEntity> {
    findAllByCloudTransferId(cloudTransferId: bigint): Promise<CloudTransferItemEntity[]>;
    /** Ver nota de `CloudTransferRepository.saveTransactional` — mismo patrón de resolución del manager. */
    updateTransactional(entity: CloudTransferItemEntity): Promise<CloudTransferItemEntity>;
}
