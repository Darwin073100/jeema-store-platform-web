import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { CloudTransferApiMapper } from "../../infraestructure/http/mappers/cloud-transfer-api.mapper";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CreateAndSendCloudTransferResult } from "./create-and-send-cloud-transfer.use-case";

/**
 * Reintenta el POST a la nube para una cabecera existente con `remoteCloudTransferId === null`. Sin
 * mutación de stock (ya se hizo en el create original). El endpoint de creación en EDYOF es idempotente por
 * `(fromCloudBranchId, localTransferId)`, así que reintentar con el mismo `cloudTransferId` local es seguro.
 * Ver spect/08_cloud_transfer_spect.md sección 5.2.
 */
export class RetrySendCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
    ) { }

    async execute(cloudTransferId: bigint): Promise<CreateAndSendCloudTransferResult> {
        let header = await this.cloudTransferRepository.findById(cloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${cloudTransferId}).`);
        }
        if (header.remoteCloudTransferId) {
            // Ya fue enviado exitosamente; no hay nada que reintentar.
            return { transfer: header, sendResult: Result.success(undefined) };
        }

        const httpBody = CloudTransferApiMapper.toCreateHttpDto(header);
        const sendResult = await this.cloudTransferApiRepository.create(httpBody);

        if (sendResult.ok && sendResult.value) {
            header.markAsCreatedInCloud(BigInt(sendResult.value.cloudTransferId));
            header = await this.cloudTransferRepository.save(header) as CloudTransferEntity;
            return { transfer: header, sendResult: Result.success(undefined) };
        }

        return { transfer: header, sendResult: Result.failure(sendResult.error as ErrorEntity) };
    }
}
