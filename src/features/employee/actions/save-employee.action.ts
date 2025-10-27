'use server'
import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { RegisterEmployeeDTO } from "../application/dtos/register-employee.dto";
import { SaveEmployeeUseCase } from "../application/use-cases/save-employee.use-case";
import { EmployeeRepositoryFactory } from "../infraestructure/factories/employee-repository.factory";

export async function saveEmployeeAction(registerEmployeeDto: RegisterEmployeeDTO, registerUserDto: RegisterUserDTO | null){
    const employeeFetchRepositoryImpl = EmployeeRepositoryFactory.create();
    const useCase = new SaveEmployeeUseCase(employeeFetchRepositoryImpl);
    
    const result = await useCase.execute(registerEmployeeDto, registerUserDto);
    return {
        ...result
    }

}