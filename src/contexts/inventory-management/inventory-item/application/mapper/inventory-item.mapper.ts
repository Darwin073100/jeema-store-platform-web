import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
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
}
