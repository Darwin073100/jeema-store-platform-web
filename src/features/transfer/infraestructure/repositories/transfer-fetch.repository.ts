import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { LocalTransferDTO } from "../../application/dtos/local-transfer.dto";
import { TransferEntity } from "../../domain/entities/transfer.entity";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { TransferMapper } from "../mappers/transfer.mapper";

export class TransferFetchRepository implements TransferRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}
    async localTransfer(command: LocalTransferDTO): Promise<Result<TransferEntity, ErrorEntity>> {
        try {
            const httpCommand = TransferMapper.toLocalTransferHttpDto(command);
            const result = await this.httpClient.post<TransferEntity>(
                this.apiConfig.getEndpointUrl('/transfers/local-transfer'),
                httpCommand
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, 'Local Transfer Inventory Item');
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