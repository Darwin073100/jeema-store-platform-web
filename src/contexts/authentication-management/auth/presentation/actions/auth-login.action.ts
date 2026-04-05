'use server'
import { AuthLoginDTO } from "../../../../../features/auth/application/dtos/auth.login.dto";
import { AuthLoginUseCase } from "../../../../../features/auth/application/use-cases/auth.login.use-case";
import { AuthFetchRepositoryImpl } from "../../../../../features/auth/infraestructure/repositories/auth-fetch-repository.impl";

export async function authLoginAction(dto: AuthLoginDTO){

    const authFetchRepositoryImpl = new AuthFetchRepositoryImpl();
    const authLoginUseCase = new AuthLoginUseCase(authFetchRepositoryImpl);

    const result = await authLoginUseCase.execute(dto);
    return {
        ...result
    } 

}