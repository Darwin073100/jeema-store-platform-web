'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { StartProcessingCloudTransferUseCase } from "../../application/use-cases/start-processing-cloud-transfer.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function startProcessingCloudTransferAction(
    cloudTransferId: bigint,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();

        const useCase = new StartProcessingCloudTransferUseCase(
            cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository,
            productRepository, inventoryRepository, branchOfficeRepository, employeeRepository,
        );

        const cookieStore = await cookies();
        const employeeCookie = cookieStore.get('employeeCookie')?.value ?? null;
        const employeeId = employeeCookie ? (JSON.parse(employeeCookie) as IEmployee).employeeId : BigInt(0);

        const result = await useCase.execute(cloudTransferId, employeeId);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        revalidatePath('/products');

        return { ok: true, value: CloudTransferMapper.toIResponse(result.value!) };
    } catch (error) {
        console.error('startProcessingCloudTransferAction: ', error);
        return {
            ...handleError(error, 'startProcessingCloudTransferAction'),
        };
    }
}
