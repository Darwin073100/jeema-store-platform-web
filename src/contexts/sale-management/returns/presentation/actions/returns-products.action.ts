'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ReturnsProductsDTO } from "../../application/dtos/returns-products.dto";
import { TypeormReturnsRepository } from "../../infraestructure/repositories/typeorm-returns.repository";
import { ReturnsProductsUseCase } from "../../application/use-cases/returns-products.use-case";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeormSaleDetailRepository } from "@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository";
import { TypeormTransactionRepository } from "@/contexts/transaction-management/transaction/infraestructure/repositories/typeorm-transaction.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { TypeormCashSessionRepository } from "@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { ReturnsAppMapper } from "../../application/mappers/returns-app.mapper";

export async function returnsProductsAction(dto: ReturnsProductsDTO) {
    try {
        const repository = await TypeormReturnsRepository.create();
        const employeeRepo = await TypeOrmEmployeeRepository.create();
        const inventoryRepo = await TypeormInventoryRepository.create();
        const inventoryItemRepo = await TypeormInventoryItemRepository.create();
        const saleDetailRepo = await TypeormSaleDetailRepository.create();
        const transactionRepo = await TypeormTransactionRepository.create();
        const transactionDBRepo = await TypeormTransactionDBRepository.create();
        const cashRepo = await TypeormCashSessionRepository.create();
        const useCase = new ReturnsProductsUseCase(
            repository, employeeRepo, inventoryRepo, inventoryItemRepo, saleDetailRepo,
            transactionRepo, cashRepo, transactionDBRepo
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

        const currentDTO = {
            ...dto,
            branchOfficeId,
            employeeId
        };
        const result = await useCase.execute(currentDTO);

        revalidatePath('/sale');

        return {
            ...Result.success(result.map(item => ReturnsAppMapper.toIResponse(item)))
        }
    } catch (error) {
        console.error('returnsProductsAction: ', error);
        return {
            ...handleError(error, 'returnsProductsAction'),
        }
    }
}