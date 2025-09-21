import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { PaymentMethodEntity } from "../../domain/entities/payment-method-entity";
import { PaymentMethodRepository } from "../../domain/repositories/payment-method.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";

export class PaymentMethodFetchRepository implements PaymentMethodRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}

    async findAll(): Promise<Result<{paymentMethods:PaymentMethodEntity[]}, ErrorEntity>> {
        try{
            const result = await this.httpClient.get<{paymentMethods:PaymentMethodEntity[]}>(
                this.apiConfig.getEndpointUrl(`/payment-methods`)
            );
            return Result.success(result.data);
        } catch(error) {
            return this.handleError(error, 'Find all PaymentMethods');
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