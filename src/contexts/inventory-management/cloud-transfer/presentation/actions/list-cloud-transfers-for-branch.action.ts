'use server'
import { cookies } from "next/headers";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { ListCloudTransfersForBranchUseCase } from "../../application/use-cases/list-cloud-transfers-for-branch.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function listCloudTransfersForBranchAction(
    direction?: 'Saliente' | 'Entrante',
): Promise<{ ok: boolean; value?: ICloudTransfer[]; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const useCase = new ListCloudTransfersForBranchUseCase(cloudTransferRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);

        const result = await useCase.execute(branchOfficeId, direction as CloudTransferDirectionEnum | undefined);

        return { ok: true, value: result.map(item => CloudTransferMapper.toIResponse(item)) };
    } catch (error) {
        console.error('listCloudTransfersForBranchAction: ', error);
        return {
            ...handleError(error, 'listCloudTransfersForBranchAction'),
        };
    }
}
