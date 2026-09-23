'use server'
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { RefreshCloudTransferFromCloudUseCase } from "../../application/use-cases/refresh-cloud-transfer-from-cloud.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function refreshCloudTransferFromCloudAction(
    cloudTransferId: bigint,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const useCase = new RefreshCloudTransferFromCloudUseCase(cloudTransferRepository, cloudTransferApiRepository);

        const result = await useCase.execute(cloudTransferId);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        return { ok: true, value: CloudTransferMapper.toIResponse(result.value!) };
    } catch (error) {
        console.error('refreshCloudTransferFromCloudAction: ', error);
        return {
            ...handleError(error, 'refreshCloudTransferFromCloudAction'),
        };
    }
}
