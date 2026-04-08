'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TypeormTransferRepository } from "../../infraestructure/repositories/typeorm-transfer.repository";
import { LocalTransferUseCase } from "../../application/use-cases/local-transfer.use-case";
import { LocalTransferDTO } from "../../application/dtos/local-transfer.dto";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { TransferMapper } from "../../application/mappers/transfer.mapper";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { AddInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";
import { DiscountInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case";

export async function localTransferAction(command: Omit<LocalTransferDTO, 'requestedByEmployeeId' | 'branchOfficeId'>) {
    try {
        const transferRepository = await TypeormTransferRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const addInventoryItemUseCase = new AddInventoryItemUseCase(inventoryItemRepository);
        const removeIncentoryItemUseCase = new DiscountInventoryItemUseCase(inventoryItemRepository)
        const useCase = new LocalTransferUseCase(
            transferRepository, inventoryRepository, inventoryItemRepository, employeeRepository,
            branchOfficeRepository, addInventoryItemUseCase, removeIncentoryItemUseCase
        );

        const cookieStore = await cookies();

        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }

        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as IEmployee).employeeId;
        }

        const currentCommand: LocalTransferDTO = {
            ...command,
            requestedByEmployeeId: employeeId,
            branchOfficeId: branchOfficeId,
        };

        const result = await useCase.execute(currentCommand);

        revalidatePath('/products');

        return {
            ...Result.success(TransferMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('localTransferAction: ', error);
        return {
            ...handleError(error, 'localTransferAction')
        }
    }
}