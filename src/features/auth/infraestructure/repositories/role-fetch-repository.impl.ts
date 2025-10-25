import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { RoleRepository } from "../../domain/repositories/role.repository";
import { RoleEntity } from "../../domain/entities/role.entity";

export class RoleFetchRepositoryImpl implements RoleRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async findAllRole(): Promise<Result<{roles: RoleEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{roles: RoleEntity[]}>(
                this.apiConfig.getEndpointUrl(`/roles`)
            );

            return Result.success(result.data);
        } catch (error:any) {
           return this.handleError(error, 'Error al traer los roles');
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