'use server'
import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { RegisterEmployeeDTO } from "../application/dtos/register-employee.dto";
import { SaveEmployeeUseCase } from "../application/use-cases/save-employee.use-case";
import { EmployeeRepositoryFactory } from "../infraestructure/factories/employee-repository.factory";
import { cookies } from "next/headers";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";

export async function saveEmployeeAction(registerEmployeeDto: RegisterEmployeeDTO, registerUserDto: RegisterUserDTO | null){
    const employeeFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new SaveEmployeeUseCase(employeeFetchRepositoryImpl);
    
    const cookieStore = await cookies();           
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }
    const result = await useCase.execute({
        ...registerEmployeeDto,
        branchOfficeId
    }, registerUserDto);
    return {
        ...result
    }

}