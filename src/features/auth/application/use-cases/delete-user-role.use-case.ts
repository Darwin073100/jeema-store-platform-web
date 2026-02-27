import { Result } from "@/shared/features/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class DeleteUserRoleUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async execute(userRoleId: bigint) {
        try {
            const result = await this.userRepository.deleteUserRole(userRoleId);
            return result;
        } catch (error) {
            return Result.failure<ErrorEntity>({
                error: '¡Error!',
                message: 'use case - Error inesperado',
                path: '/user role',
                statusCode: 500,
                timestamp: new Date().toDateString()
            });
        }
    }
}