import { Result } from "@/shared/features/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserRoleDTO } from "../dtos/update-user-role.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class UpdateUserRoleUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async execute(dto: UpdateUserRoleDTO) {
        try {
            const result = await this.userRepository.updateUserRole(dto);
            return result;
        } catch (error) {
            return Result.failure<ErrorEntity>({
                error: '500: ¡Error!',
                message: 'use case - Error inesperado',
                path: '/user role',
                statusCode: 500,
                timestamp: new Date().toDateString()
            });
        }
    }
}