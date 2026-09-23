'use server'
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FindCloudTransferByIdUseCase } from "../../application/use-cases/find-cloud-transfer-by-id.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function findCloudTransferByIdAction(
    cloudTransferId: bigint,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const useCase = new FindCloudTransferByIdUseCase(cloudTransferRepository);

        const result = await useCase.execute(cloudTransferId);

        return { ok: true, value: CloudTransferMapper.toIResponse(result) };
    } catch (error) {
        console.error('findCloudTransferByIdAction: ', error);
        return {
            ...handleError(error, 'findCloudTransferByIdAction'),
        };
    }
}
