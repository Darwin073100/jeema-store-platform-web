import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { TransactionMapper } from "../mappers/transaction.mapper";

export class TransactionFectchRepository implements TransactionRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async save(dto: RegisterTransactionDTO): Promise<Result<TransactionEntity, ErrorEntity>> {
        try {
            const httpDto = TransactionMapper.toRegisterTransactionHttpDTO(dto);

            const response = await this.httpClient.post<TransactionEntity>(
                this.apiConfig.getEndpointUrl('/transactions'),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Register Transactions');
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