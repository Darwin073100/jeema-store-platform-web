'use server'
import { RegisterUserWithEmployeeDTO } from "../../../../../features/auth/application/dtos/register-user-with-employee.dto";
import { RegisterUserWithEmployeeUseCase } from "../../../../../features/auth/application/use-cases/register-user-with-employee.use-case";
import { UserRepositoryFactory } from "../../../../../features/auth/infraestructure/factories/user-repository.factory";

export async function registerUserWithEmployeeAction(dto: RegisterUserWithEmployeeDTO){
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const registerUserWithEmployeeUseCase = new RegisterUserWithEmployeeUseCase(userFetchRepositoryImpl);

    const result = await registerUserWithEmployeeUseCase.execute(dto);
    
    return {
        ...result
    }
}