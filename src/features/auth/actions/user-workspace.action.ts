'use server'
import { AuthAccesTokenDTO } from "../application/dtos/auth.access-token.dto";
import { UserWorkspaceUseCase } from "../application/use-cases/user-workspace.use-case";
import { AuthFetchRepositoryImpl } from "../infraestructure/repositories/auth-fetch-repository.impl";

export async function userWorkspaceAction(dto: AuthAccesTokenDTO) {
    const authFetchRepositoryImpl = new AuthFetchRepositoryImpl();
    const userWorkspaceUseCase = new UserWorkspaceUseCase(authFetchRepositoryImpl);

    const result = await userWorkspaceUseCase.execute(dto);
    return {
        ...result
    };

}