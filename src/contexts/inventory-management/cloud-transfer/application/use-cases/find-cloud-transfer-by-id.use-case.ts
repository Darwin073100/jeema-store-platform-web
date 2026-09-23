import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";

/** Lectura local simple por id, sin llamar a la nube. */
export class FindCloudTransferByIdUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
    ) { }

    async execute(cloudTransferId: bigint): Promise<CloudTransferEntity> {
        const transfer = await this.cloudTransferRepository.findById(cloudTransferId);
        if (!transfer) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${cloudTransferId}).`);
        }
        return transfer;
    }
}
