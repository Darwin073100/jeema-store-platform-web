import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { InventoryResponseDTO } from "../../domain/entities/inventory-response.dto";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { RegisterInventoryItemDTO } from "../../application/dtos/register-inventory-item.dto";

export class InventoryItemFetchRepositoryImpl implements InventoryItemRepository {
    private readonly URL = `${process.env.URL_EDYOF_PLATFORM_API}${process.env.PREFIX_EDYOF_PLATFORM_API}/inventory-items`;
   
    async viewAllInventoryItem(): Promise<Result<{ inventoryItems: InventoryResponseDTO[] }, ErrorEntity>> {
        try {
            const response = await fetch(`${this.URL}`,{
                method: 'GET'
            });

            if (!response.ok) {
                const error = await response.json() as ErrorEntity;
                return Result.failure(error);
            }

            const inventory = await response.json() as { inventoryItems: InventoryResponseDTO[] };
            return Result.success(inventory);

        } catch (error: any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor: inventory',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/inventory-items`,
                timestamp: new Date().toDateString()
            } satisfies ErrorEntity);
        }
    }

    async save(dto: RegisterInventoryItemDTO): Promise<Result<InventoryResponseDTO, ErrorEntity>> {
        try {
            const response = await fetch(`${this.URL}`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto)
            });

            if (!response.ok) {
                const error = await response.json() as ErrorEntity;
                return Result.failure(error);
            }

            const inventory = await response.json() as InventoryResponseDTO;
            return Result.success(inventory);

        } catch (error: any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/establishments`,
                timestamp: new Date().toDateString()
            } satisfies ErrorEntity);
        }
    }
}