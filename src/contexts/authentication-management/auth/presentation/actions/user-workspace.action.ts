'use server'
import { getServerSession } from "next-auth";
import { GetUserWorkspaceUseCase } from "../../application/use-cases/get-user-workspace.use-case";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { authOptions } from "@/shared/lib/auth";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { UserMapper } from "../../application/mapper/user.mapper";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { IUserWorkspace } from "../../application/dtos/IUserWorkspace";

export async function userWorkspaceAction(): Promise<{
    ok: boolean;
    value?: IUserWorkspace;
    error?: ErrorEntity | undefined;
}> {
    try {
        const userRepository = await TyperomUserRepository.create();
        const userWorkspaceUseCase = new GetUserWorkspaceUseCase(userRepository);

        const session = await getServerSession(authOptions);

        const result = await userWorkspaceUseCase.execute(BigInt(session?.user.id ?? 0));
        return {
            ...Result.success(UserMapper.toIUserWorkspace(result))
        };

    } catch (error) {
        return {
            ...handleError(error, 'userWorkspaceAction')
        }
    }
}