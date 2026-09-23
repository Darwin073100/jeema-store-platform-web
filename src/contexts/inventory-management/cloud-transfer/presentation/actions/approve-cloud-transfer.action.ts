'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmLotRepository } from "@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { ApproveCloudTransferUseCase } from "../../application/use-cases/approve-cloud-transfer.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function approveCloudTransferAction(
    cloudTransferId: bigint,
    notes?: string,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();

        const useCase = new ApproveCloudTransferUseCase(
            cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository,
            branchOfficeRepository, lotRepository, inventoryItemRepository, transactionDB,
        );

        const cookieStore = await cookies();
        const employeeCookie = cookieStore.get('employeeCookie')?.value ?? null;
        const employeeId = employeeCookie ? (JSON.parse(employeeCookie) as IEmployee).employeeId : BigInt(0);

        const result = await useCase.execute(cloudTransferId, employeeId, notes ?? null);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        revalidatePath('/products');

        return { ok: true, value: CloudTransferMapper.toIResponse(result.value!) };
    } catch (error) {
        console.error('approveCloudTransferAction: ', error);
        return {
            ...handleError(error, 'approveCloudTransferAction'),
        };
    }
}
