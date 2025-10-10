import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { InventoryResponseDTO } from "../../domain/entities/inventory-response.dto";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { RegisterInventoryItemDTO } from "../../application/dtos/register-inventory-item.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { InventoryItemMapper } from "../mappers/inventory-item.mapper";
import { InventoryItemEntity } from "../../domain/entities/inventory-item-response.dto";
import { UpdateInventoryItemDTO } from "../../application/dtos/update-inventory-item.dto";

export class InventoryItemFetchRepositoryImpl implements InventoryItemRepository {
   constructor(
    private readonly httpClient: HttpClient,
    private readonly apiConfig: ApiConfig
   ){}
    async viewAllInventoryItem(): Promise<Result<{ inventoryItems: InventoryResponseDTO[] }, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{inventoryItems: InventoryResponseDTO[]}>(
                this.apiConfig.getEndpointUrl('/inventory-items')
            );
            return Result.success(result.data);

        } catch (error: any) {
            return this.handleError(error, 'View all Items Inventories')
        }
    }

    async save(dto: RegisterInventoryItemDTO): Promise<Result<InventoryItemEntity, ErrorEntity>> {
        try {
            const httpDto = InventoryItemMapper.toRegisterInventoryItemHttpDTO(dto);
            const result = await this.httpClient.post<InventoryItemEntity>(
                this.apiConfig.getEndpointUrl('/inventory-items'),
                httpDto
            );
            return Result.success(result.data);

        } catch (error: any) {
            return this.handleError(error, 'Register Inventory Item')
        }
    }

    async update(dto: UpdateInventoryItemDTO): Promise<Result<InventoryItemEntity, ErrorEntity>> {
        try {
            const httpDto = InventoryItemMapper.toUpdateInventoryItemHttpDTO(dto);
            const result = await this.httpClient.patch<InventoryItemEntity>(
                this.apiConfig.getEndpointUrl('/inventory-items'),
                httpDto
            );
            return Result.success(result.data);

        } catch (error: any) {
            console.log(error)
            return this.handleError(error, 'Update Inventory Item')
        }
    }

    async deleteById(inventoryItemId: bigint): Promise<Result<any, ErrorEntity> | undefined>{
        try {
            const httpId = inventoryItemId.toString();
            const result = await this.httpClient.delete<any>(
                this.apiConfig.getEndpointUrl(`inventory-items/${httpId}`)
            );

            return Result.success(result.data);
        } catch (error) {
            this.handleError(error, 'Delete Inventory Item');
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