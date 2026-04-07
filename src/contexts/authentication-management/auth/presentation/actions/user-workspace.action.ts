'use server'
import { getServerSession } from "next-auth";
import { GetUserWorkspaceUseCase } from "../../application/use-cases/get-user-workspace.use-case";
import { TyperomUserRepository } from "../../infraestructure/repositories/typeorm-user.repository";
import { authOptions } from "@/shared/lib/auth";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { UserMapper } from "../../application/mapper/user.mapper";

export async function userWorkspaceAction() {
    try {
        const userRepository = await TyperomUserRepository.create();
        const userWorkspaceUseCase = new GetUserWorkspaceUseCase(userRepository);

        const session = await getServerSession(authOptions);

        const result = await userWorkspaceUseCase.execute(BigInt(session?.user.id ?? 2));

        return {
            ...Result.success(UserMapper.toIUserWorkspace(result))
        };

    } catch (error) {
        return {
            ...handleError(error, 'userWorkspaceAction')
        }
    }
}