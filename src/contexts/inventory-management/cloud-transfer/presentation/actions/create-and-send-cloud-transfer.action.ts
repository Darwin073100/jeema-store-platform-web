'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeormCategoryRepository } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository";
import { TypeOrmBrandRepository } from "@/contexts/product-management/brand/infraestruture/persistence/typeorm/repositories/typeorm-brand.repository";
import { TypeOrmLotRepository } from "@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { CreateAndSendCloudTransferUseCase } from "../../application/use-cases/create-and-send-cloud-transfer.use-case";
import { CreateCloudTransferDto } from "../../application/dtos/create-cloud-transfer.dto";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function createAndSendCloudTransferAction(
    command: Omit<CreateCloudTransferDto, 'fromBranchOfficeId' | 'requestedByEmployeeId'>,
): Promise<{ ok: boolean; value?: ICloudTransfer; sendError?: ErrorEntity; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const categoryRepository = await TypeormCategoryRepository.create();
        const brandRepository = await TypeOrmBrandRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();

        const useCase = new CreateAndSendCloudTransferUseCase(
            cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository,
            branchOfficeRepository, employeeRepository, productRepository, categoryRepository,
            brandRepository, lotRepository, inventoryRepository, inventoryItemRepository, transactionDB,
        );

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);
        const employeeCookie = cookieStore.get('employeeCookie')?.value ?? null;
        const employeeId = employeeCookie ? (JSON.parse(employeeCookie) as IEmployee).employeeId : BigInt(0);

        const dto: CreateCloudTransferDto = {
            ...command,
            fromBranchOfficeId: branchOfficeId,
            requestedByEmployeeId: employeeId,
        };

        const { transfer, sendResult } = await useCase.execute(dto);

        revalidatePath('/products');

        return {
            ok: true,
            value: CloudTransferMapper.toIResponse(transfer),
            sendError: sendResult.ok ? undefined : sendResult.error,
        };
    } catch (error) {
        console.error('createAndSendCloudTransferAction: ', error);
        return {
            ...handleError(error, 'createAndSendCloudTransferAction'),
        };
    }
}
