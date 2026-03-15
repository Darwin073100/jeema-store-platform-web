import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
import { IInventoryItem } from "../../presentation/interfaces/IInventoryItem";
import { InventoryItemResponseDto } from "../dtos/inventory-item-response.dto";
import { InventoryMapper } from "src/contexts/inventory-management/inventory/application/mapper/inventory.mapper";

export class InventoryItemMapper {
    static toResponseDto(entity: InventoryItemEntity): InventoryItemResponseDto {
        return new InventoryItemResponseDto(
            entity.inventoryItemId.toString(),
            entity.inventoryId.toString(),
            entity.location,
            Number(entity.quantityOnHand.value),
            new Date(),
            Number(0),
            entity.createdAt,
            null,
            entity.updatedAt,
            entity.deletedAt,
            entity.inventory? InventoryMapper.toResponseDto(entity.inventory) : null,
        );
    }
    static toIResponse(entity: InventoryItemEntity): IInventoryItem {
        const result: IInventoryItem = {
            inventoryItemId: entity.inventoryItemId,
            inventoryId: entity.inventoryId,
            location: entity.location,
            quantityOnHan: Number(entity.quantityOnHand.value),
            lastStockedAt: new Date(),
            purchasePriceAtStock: Number(0),
            createdAt: entity.createdAt,
            internalBarCode: null,
            updatedAt: entity.updatedAt ?? null,
            deletedAt: entity.deletedAt ?? null,
            inventory: entity.inventory? InventoryMapper.toIResponse(entity.inventory) : null,
        };
        return result;
    }
}
