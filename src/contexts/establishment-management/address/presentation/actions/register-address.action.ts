'use server'
import { Result } from "@/shared/lib/utils/result";
import { AddressMapper } from "../../application/mappers/address.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { RegisterAddressMany } from "../../application/dtos/register-address-many.dto";
import { RegisterAddressUseCase } from "../../application/use-cases/register-address.use-case";
import { TypeormAddressRepository } from "../../infraestructure/infraestructure/typeorm-address.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmCustomerRepository } from "@/contexts/sale-management/customer/infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { TypeOrmSuplierRepository } from "@/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { revalidatePath } from "next/cache";

export async function registerAddressAction(dto: RegisterAddressMany) {
    try {
        const addressRepository = await TypeormAddressRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const customerRepository = await TypeOrmCustomerRepository.create();
        const suplierRepository = await TypeOrmSuplierRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const transaction = await TypeormTransactionDBRepository.create();

        const useCase = new RegisterAddressUseCase(
            addressRepository, employeeRepository, customerRepository, suplierRepository,
            branchOfficeRepository, transaction
        );

        const result = await useCase.execute(dto);
        
        if(dto.branchOfficeId){
            revalidatePath('/');
        }
        if(dto.employeeId){
            revalidatePath('/configurations');
        }
        if(dto.suplierId){
            revalidatePath('/purchases');
        }
        if(dto.customerId){
            revalidatePath('/customers');
        }

        return {
            ...Result.success(AddressMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'registerAddressAction')
        }
    }
}