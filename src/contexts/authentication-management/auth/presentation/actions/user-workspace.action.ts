'use server'
import { AuthAccesTokenDTO } from "../../../../../features/auth/application/dtos/auth.access-token.dto";
import { UserWorkspaceUseCase } from "../../../../../features/auth/application/use-cases/user-workspace.use-case";
import { AuthFetchRepositoryImpl } from "../../../../../features/auth/infraestructure/repositories/auth-fetch-repository.impl";

export async function userWorkspaceAction(dto: AuthAccesTokenDTO) {
    const authFetchRepositoryImpl = new AuthFetchRepositoryImpl();
    const userWorkspaceUseCase = new UserWorkspaceUseCase(authFetchRepositoryImpl);

    const result = await userWorkspaceUseCase.execute(dto);
    return {
        ...result
    };

}