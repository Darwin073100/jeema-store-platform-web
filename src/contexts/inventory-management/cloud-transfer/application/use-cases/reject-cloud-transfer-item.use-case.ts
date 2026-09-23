import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { CloudTransferItemNotFoundException } from "../../domain/exceptions/cloud-transfer-item-not-found.exception";
import { RejectCloudTransferItemDto } from "../dtos/reject-cloud-transfer-item.dto";

/**
 * Implícito en el enum de resolución (no listado explícitamente en la tarea, pero necesario para que
 * `ApproveCloudTransferUseCase` pueda avanzar con líneas que B decide no recibir). Ver
 * spect/08_cloud_transfer_spect.md sección 5.9.
 */
export class RejectCloudTransferItemUseCase {
    constructor(
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
    ) { }

    async execute(dto: RejectCloudTransferItemDto): Promise<CloudTransferItemEntity> {
        const item = await this.cloudTransferItemRepository.findById(dto.cloudTransferItemId);
        if (!item) {
            throw new CloudTransferItemNotFoundException(`No se encontró el item de traspaso (${dto.cloudTransferItemId}).`);
        }
        item.reject(dto.reason);
        return this.cloudTransferItemRepository.save(item);
    }
}
