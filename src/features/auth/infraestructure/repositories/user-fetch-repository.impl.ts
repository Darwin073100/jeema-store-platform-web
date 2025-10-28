import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDTO } from "../../application/dtos/register-user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";

export class UserFetchRepositoryImpl implements UserRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async saveWithEmployee(dto: RegisterUserWithEmployeeDTO): Promise<Result<any, ErrorEntity>> {
        try {
            const result = await this.httpClient.post<any>(
                this.apiConfig.getEndpointUrl(`/users/with-employee`),
                dto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return this.handleError(error, 'Error al guardar usuario.');
        }
    }
    async save(dto: RegisterUserDTO): Promise<Result<UserEntity, ErrorEntity>> {
        const httpDTO = UserMapper.toRegisterUserHttpDTO(dto);
        try {
            const result = await this.httpClient.post<UserEntity>(
                this.apiConfig.getEndpointUrl(`/users`),
                httpDTO
            );

            return Result.success(result.data);
        } catch (error:any) {
           return this.handleError(error, 'Error al guardar usuario.');
        }
    }
    async update(establishmentId: bigint, userId: bigint, dto: UpdateUserDTO): Promise<Result<UserEntity, ErrorEntity>> {
        try {
            const result = await this.httpClient.patch<UserEntity>(
                this.apiConfig.getEndpointUrl(`/users/${userId.toString()}/establishments/${establishmentId.toString()}`),
                dto
            );

            return Result.success(result.data);
        } catch (error:any) {
           return this.handleError(error, 'Error al actualizar usuario.');
        }
    }

    async findAllByEstablishmentId(establishmentId: bigint): Promise<Result<{users: UserEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{users: UserEntity[]}>(
                this.apiConfig.getEndpointUrl(`/users/all/establishments/${establishmentId.toString()}`)
            );

            return Result.success(result.data);
        } catch (error:any) {
           return this.handleError(error, 'Error al traer los usuarios');
        }
    }

    /**
     * Manejo centralizado de errores
     */
    private handleError(error: any, operation: string): Result<any, ErrorEntity> {
        // Si es un error HTTP (del servidor)
        if (error.status && error.data) {
            return Result.failure(error.data as ErrorEntity);
        }

        // Si es un error de red o conexión
        return Result.failure({
            error: error?.message || error,
            message: `No se pudo conectar al servidor durante: ${operation}`,
            statusCode: error?.status || 500,
            path: operation,
            timestamp: new Date().toDateString()
        } satisfies ErrorEntity);
    }
}