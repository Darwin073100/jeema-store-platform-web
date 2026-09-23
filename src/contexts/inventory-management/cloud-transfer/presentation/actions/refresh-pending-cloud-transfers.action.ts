'use server'
import { cookies } from "next/headers";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { RefreshPendingCloudTransfersUseCase } from "../../application/use-cases/refresh-pending-cloud-transfers.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function refreshPendingCloudTransfersAction(): Promise<{ ok: boolean; value?: ICloudTransfer[]; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new RefreshPendingCloudTransfersUseCase(cloudTransferRepository, cloudTransferApiRepository, branchOfficeRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);

        const result = await useCase.execute(branchOfficeId);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        return { ok: true, value: result.value!.map(item => CloudTransferMapper.toIResponse(item)) };
    } catch (error) {
        console.error('refreshPendingCloudTransfersAction: ', error);
        return {
            ...handleError(error, 'refreshPendingCloudTransfersAction'),
        };
    }
}
