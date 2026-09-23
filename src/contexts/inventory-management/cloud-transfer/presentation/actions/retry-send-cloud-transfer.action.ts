'use server'
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { RetrySendCloudTransferUseCase } from "../../application/use-cases/retry-send-cloud-transfer.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function retrySendCloudTransferAction(
    cloudTransferId: bigint,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const useCase = new RetrySendCloudTransferUseCase(cloudTransferRepository, cloudTransferApiRepository);

        const { transfer, sendResult } = await useCase.execute(cloudTransferId);

        if (!sendResult.ok) {
            return { ok: false, value: CloudTransferMapper.toIResponse(transfer), error: sendResult.error };
        }

        return { ok: true, value: CloudTransferMapper.toIResponse(transfer) };
    } catch (error) {
        console.error('retrySendCloudTransferAction: ', error);
        return {
            ...handleError(error, 'retrySendCloudTransferAction'),
        };
    }
}
