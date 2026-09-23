'use server'
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { CancelCloudTransferUseCase } from "../../application/use-cases/cancel-cloud-transfer.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function cancelCloudTransferAction(
    cloudTransferId: bigint,
    reason?: string,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new CancelCloudTransferUseCase(cloudTransferRepository, cloudTransferApiRepository, branchOfficeRepository);

        const result = await useCase.execute(cloudTransferId, reason ?? null);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        return { ok: true, value: CloudTransferMapper.toIResponse(result.value!) };
    } catch (error) {
        console.error('cancelCloudTransferAction: ', error);
        return {
            ...handleError(error, 'cancelCloudTransferAction'),
        };
    }
}
