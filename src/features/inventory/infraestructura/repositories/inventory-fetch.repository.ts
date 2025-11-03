import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { RegisterInventoryDTO } from "../../application/dtos/register-inventory.dto";
import { UpdateInventoryDTO } from "../../application/dtos/update-inventory.dto";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";
import { InventoryMapper } from "../mappers/inventory.mapper";
import { LocationEnum } from "../../domain/enums/location.enum";
import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
import { EditInventoryItemDTO } from "../../application/dtos/edit-inventory-item.dto";

export class InventoryFetchRepository implements InventoryRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}
    async save(dto: RegisterInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>> {
        try {
            const httpDto = InventoryMapper.toRegisterInventoryHttpDTO(dto);
            const result = await this.httpClient.post<InventoryEntity>(
                this.apiConfig.getEndpointUrl('/inventories'),
                httpDto
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, 'Register Inventory');
        }
    } 
    async update(dto: UpdateInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>> {
        try {
            const httpDto = InventoryMapper.toUpdateInventoryHttpDTO(dto);
            const result = await this.httpClient.patch<InventoryEntity>(
                this.apiConfig.getEndpointUrl('/inventories'),
                httpDto
            );
            return Result.success(result.data);
        } catch (error) {
            console.log(error);
            return this.handleError(error, 'Update Inventory');
        }
    }

    async editItem(dto: EditInventoryItemDTO):Promise<Result<InventoryEntity, ErrorEntity>> {
        try {
            const result = await this.httpClient.patch<InventoryEntity>(
                this.apiConfig.getEndpointUrl(`/inventories/${dto.inventoryId.toString()}/items/${dto.inventoryItemId.toString()}`),
                {location: dto.location, quantityOnHand: dto.quantityOnHand}
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, 'Update Inventory');
        }
    }

    async addStockItem(itemId: bigint, addQuantity: number): Promise<Result<InventoryItemEntity, ErrorEntity>> {
        console.log('AddStockItem');
        try {
            const result = await this.httpClient.patch<InventoryItemEntity>(
                this.apiConfig.getEndpointUrl(`/inventories/add/items/${itemId.toString()}`),
                {quantityOnHand: addQuantity}
            );
            return Result.success(result.data);
        } catch (error) {
            console.log(error)
            return this.handleError(error, 'Update Inventory');
        }
    }

    async findByBarCode(barCode: string): Promise<Result<InventoryEntity, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<InventoryEntity>(
                this.apiConfig.getEndpointUrl(`/inventories?barCode=${barCode}`)
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, 'Find Inventory By BarCode');
        }
    }

    async findAllByLocationAndBranchOffice(branchOfficeId: bigint, location: LocationEnum): Promise<Result<{items:InventoryItemEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.get<{items:InventoryItemEntity[]}>(
                this.apiConfig.getEndpointUrl(`/inventories/all/items?branchOfficeId=${branchOfficeId}&location=${location.toString()}`)
            );
            return Result.success(result.data);
        } catch (error) {
            return this.handleError(error, 'Find Inventory by location and branch office');
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