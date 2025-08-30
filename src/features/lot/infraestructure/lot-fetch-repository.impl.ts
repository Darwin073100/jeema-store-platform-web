import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterLotDTO } from "../application/dtos/register-lot.dto";
import { LotEntity } from "../domain/entities/lot.entity";
import { LotRepository } from "../domain/repositories/lot.repository";
import { UpdateLotDTO } from "../application/dtos/update-lot.dto";
import { LotMapper } from "./mappers/lot.mapper";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { AddLotUnitPurchaseDTO } from "../application/dtos/add-lot-unit-purchase.dto";
import { LotUnitPurchaseEntity } from "../domain/entities/lot-unit-purchase.entity";
import { UpdateLotUnitPurchaseDTO } from "../application/dtos/update-lot-unit-purchase.dto";

export class LotFetchRepositoryImpl implements LotRepository {

    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}
    async save(dto: RegisterLotDTO): Promise<Result<LotEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toRegisterLotHttpRequest(dto);
            const result = await this.httpClient.post<LotEntity>(
                this.apiConfig.getEndpointUrl('/lots'),
                httpDto
            )

            return Result.success(result.data)
        } catch (error: any) {
            return this.handleError(error, 'Save Lot');
        }
    }

    async addPurchaseUnit(dto: AddLotUnitPurchaseDTO): Promise<Result<LotUnitPurchaseEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toAddLotUnitPurchaseHttpDTO(dto);
            const result = await this.httpClient.post<LotUnitPurchaseEntity>(
                this.apiConfig.getEndpointUrl(`/lots/${httpDto.lotId}/unit-purchases`),
                {
                    ...httpDto,
                    lotId: undefined
                }
            );
            return Result.success(result.data)
        } catch (error) {
            return this.handleError(error, 'Add purchase unit');
        }
    }
    
    async updatePurchaseUnit(dto: UpdateLotUnitPurchaseDTO): Promise<Result<LotUnitPurchaseEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toUpdateLotUnitPurchaseHttpDTO(dto);
            const result = await this.httpClient.patch<LotUnitPurchaseEntity>(
                this.apiConfig.getEndpointUrl(`/lots/${httpDto.lotId}/unit-purchases`),
                {
                    ...httpDto,
                    lotId: undefined
                }
            );
            return Result.success(result.data)
        } catch (error) {
            return this.handleError(error, 'Update purchase unit');
        }
    }
    
    async update(dto: UpdateLotDTO): Promise<Result<LotEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toUpdateLotHttpRequest(dto);
            const result = await this.httpClient.patch<LotEntity>(
                this.apiConfig.getEndpointUrl('/lots'),
                httpDto
            )

            return Result.success(result.data)
        } catch (error: any) {
            return this.handleError(error, 'Update Lot');
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