'use server'
import { revalidatePath } from "next/cache";
import { RegisterUserDTO } from "../application/dtos/register-user.dto";
import { RegisterUserUseCase } from "../application/use-cases/register-user.use-case";
import { UserRepositoryFactory } from "../infraestructure/factories/user-repository.factory";

export async function registerUserAction(dto: RegisterUserDTO){
    const userFetchRepositoryImpl = UserRepositoryFactory.create();
    const useCase = new RegisterUserUseCase(userFetchRepositoryImpl);

    const result = await useCase.execute(dto);

    if(result.ok){
        revalidatePath('/configurations/employees');
        revalidatePath('/configurations/users');
    }
    
    return {
        ...result
    }
}