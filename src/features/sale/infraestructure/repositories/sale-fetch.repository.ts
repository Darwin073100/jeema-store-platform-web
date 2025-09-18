import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { SaleEntity } from "../../domain/entities/sale-entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { SaleMapper } from "../mappers/sale.mapper";

export class SaleFetchRepository implements SaleRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}
    
    async save(dto: RegisterSaleDto): Promise<Result<SaleEntity, ErrorEntity>> {
        try {
            const httpDto = SaleMapper.toHttpRegisterSaleDTO(dto);

            const response = await this.httpClient.post<SaleEntity>(
                this.apiConfig.getEndpointUrl('/sales'),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Register Sale');
        }    
    }
    async findSaleWithDetails(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>> {
        try {

            const response = await this.httpClient.get<SaleEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/details`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find sale with details');
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