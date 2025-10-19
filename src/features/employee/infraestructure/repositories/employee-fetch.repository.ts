import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";

export class EmployeeFetchRepository implements EmployeeRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async findAllEmployeesByEstablishmentId(establishmentId: bigint): Promise<Result<{ employees: EmployeeEntity[] }, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{ employees: EmployeeEntity[] }>(
                this.apiConfig.getEndpointUrl(`/employees/all/establishments/${establishmentId.toString()}`)
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, '');
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