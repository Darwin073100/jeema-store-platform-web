import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { RegisterUserWithEmployeeDTO } from "../../application/dtos/register-user-with-employee.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { UserEntity } from "../../domain/entities/user.entity";

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