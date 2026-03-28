'use server';
import { cookies } from "next/headers";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { AddDetailToSaleDto } from "@/contexts/sale-management/sale-detail/application/dtos/add-detail-to-sale.dto";
import { CreateSaleAndAddDetailUseCase } from "../../application/use-cases/create-sale-and-add-detail.use-case";
import { RegisterSaleUseCase } from "../../application/use-cases/register-sale.use-case";
import { RegisterSaleDetailUseCase } from "@/contexts/sale-management/sale-detail/application/use-case/register-sale-detail.use-case";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmCustomerRepository } from "@/contexts/sale-management/customer/infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeormCashSessionRepository } from "@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { TypeormSaleDetailRepository } from "@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";

export async function CreateSaleAndAddDetailAction(customerId: bigint, cashRegisterId: bigint, addDetailDTO: AddDetailToSaleDto) {
    try {
        const repository = await TypeormSaleRepository.create();
        const saleDetailRepository = await TypeormSaleDetailRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const customerRepository = await TypeOrmCustomerRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const cashSessionRepo = await TypeormCashSessionRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();
        const registerSaleUseCase = new RegisterSaleUseCase(repository, branchOfficeRepository, customerRepository, employeeRepository, cashSessionRepo, transactionDB);
        const registerSaleDetailUseCase = new RegisterSaleDetailUseCase(saleDetailRepository, repository, inventoryRepository);
        const useCase = new CreateSaleAndAddDetailUseCase(repository, registerSaleUseCase, registerSaleDetailUseCase);

        const cookieStore = await cookies();
        let branchOffice;
        let employee;
        branchOffice = cookieStore.get("branchOfficeCookie")?.value;
        employee = cookieStore.get("employeeCookie")?.value;

        if (branchOffice && employee) {
            branchOffice = JSON.parse(branchOffice) as IBranchOffice;
            employee = JSON.parse(employee) as IEmployee;

            const newRegisterDaleDto: RegisterSaleDto = {
                branchOfficeId: BigInt(branchOffice.branchOfficeId),
                employeeId: BigInt(employee.employeeId),
                customerId: customerId,
                cashRegisterId: cashRegisterId
            }
            const result = await useCase.execute(newRegisterDaleDto, addDetailDTO);
            return {
                ...Result.success(SaleMapper.toIResponse(result))
            }
        } else {
            const newRegisterDaleDto: RegisterSaleDto = {
                branchOfficeId: BigInt(0),
                employeeId: BigInt(0),
                customerId: BigInt(0),
                cashRegisterId: BigInt(0),
            }
            const result = await useCase.execute(newRegisterDaleDto, addDetailDTO);
            return {
                ...Result.success(SaleMapper.toIResponse(result))
            }

        }
    }catch(error){
        return {
            ...handleError(error, 'CreateSaleAndAddDetailAction')
        }
    }
}