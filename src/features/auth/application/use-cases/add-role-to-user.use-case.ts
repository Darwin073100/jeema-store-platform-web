import { Result } from "@/shared/features/result";
import { UserRepository } from "../../domain/repositories/user.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { AddRoleToUserDTO } from "../dtos/add-role-to-user.dto";

export class AddRoleToUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async execute(dto: AddRoleToUserDTO) {
        try {
            const result = await this.userRepository.addRoleToUser(dto);
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