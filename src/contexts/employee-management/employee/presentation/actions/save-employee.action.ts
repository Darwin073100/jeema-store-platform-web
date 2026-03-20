'use server'
import { cookies } from "next/headers";
import { RegisterEmployeeDto } from "../../application/dtos/register-employee.dto";
import { RegisterUserDTO } from "@/contexts/authentication-management/auth/application/dtos/register-user.dto";
import { TypeOrmEmployeeRepository } from "../../infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { RegisterEmployeeUseCase } from "../../application/use-cases/register-employee.use-case";
import { TypeOrmEmployeeRoleRepository } from "@/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/repositories/typeorm-employee-role.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { EmployeeMapper } from "../../application/mappers/employee.mapper";

export async function saveEmployeeAction(registerEmployeeDto: RegisterEmployeeDto, registerUserDto: RegisterUserDTO | null){
    try{
        const employeeRepository = await TypeOrmEmployeeRepository.create();
    const employeeRoleRepository = await TypeOrmEmployeeRoleRepository.create();
    const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
    const transactionRepository = await TypeormTransactionDBRepository.create();

    const useCase = new RegisterEmployeeUseCase(employeeRepository, employeeRoleRepository, branchOfficeRepository, transactionRepository);
    
    const cookieStore = await cookies();           
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
    }
    const result = await useCase.execute({
        ...registerEmployeeDto,
        branchOfficeId
    });
    return {
        ...Result.success(EmployeeMapper.toIResponse(result))
    }
    }catch(error){
        return {
            ...handleError(error, 'saveEmployeeAction')
        }
    }

}