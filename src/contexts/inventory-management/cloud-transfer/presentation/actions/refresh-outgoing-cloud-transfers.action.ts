'use server'
import { cookies } from "next/headers";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { RefreshOutgoingCloudTransfersUseCase } from "../../application/use-cases/refresh-outgoing-cloud-transfers.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function refreshOutgoingCloudTransfersAction(): Promise<{ ok: boolean; value?: ICloudTransfer[]; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const useCase = new RefreshOutgoingCloudTransfersUseCase(cloudTransferRepository, cloudTransferApiRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);

        const result = await useCase.execute(branchOfficeId);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        return { ok: true, value: result.value!.map(item => CloudTransferMapper.toIResponse(item)) };
    } catch (error) {
        console.error('refreshOutgoingCloudTransfersAction: ', error);
        return {
            ...handleError(error, 'refreshOutgoingCloudTransfersAction'),
        };
    }
}
