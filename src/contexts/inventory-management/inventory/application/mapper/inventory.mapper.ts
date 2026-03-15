import { ProductMapper } from "src/contexts/product-management/product/application/mappers/product.mapper";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryResponseDto } from "../dtos/inventory-response.dto";
import { InventoryItemMapper } from "src/contexts/inventory-management/inventory-item/application/mapper/inventory-item.mapper";
import { IInventory } from "../../presentation/interfaces/IInventory";

export class InventoryMapper {
    static toResponseDto(entity: InventoryEntity): InventoryResponseDto {
        return new InventoryResponseDto(
            entity.inventoryId,
            entity.productId,
            entity.branchOfficeId,
            entity.isSellable,
            entity.createdAt,
            entity.internalBarCode?.value,
            entity.salePriceOne?.value,
            entity.salePriceMany?.value,
            entity.saleQuantityMany?.value,
            entity.salePriceSpecial?.value,
            entity.minStockBranch?.value,
            entity.maxStockBranch?.value,
            entity.updatedAt,
            entity.deletedAt,
            entity.product? ProductMapper.toResponseDto(entity.product) : null,
            entity.inventoryItems ? entity.inventoryItems?.map(item => InventoryItemMapper.toResponseDto(item)): null,
        );
    }
    static toIResponse(entity: InventoryEntity): IInventory {
        const inventory: IInventory = {
            inventoryId: entity.inventoryId,
            productId: entity.productId,
            branchOfficeId: entity.branchOfficeId,
            isSellable: entity.isSellable,
            createdAt: entity.createdAt,
            internalBarCode: entity.internalBarCode?.value,
            salePriceOne: entity.salePriceOne?.value,
            salePriceMany: entity.salePriceMany?.value,
            saleQuantityMany: entity.saleQuantityMany?.value,
            salePriceSpecial: entity.salePriceSpecial?.value,
            minStockBranch: entity.minStockBranch?.value,
            maxStockBranch: entity.maxStockBranch?.value,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            product: entity.product? ProductMapper.toIResponse(entity.product) : null,
            inventoryItems: entity.inventoryItems ? entity.inventoryItems?.map(item => InventoryItemMapper.toIResponse(item)): [],
        };
        return inventory;
    }
}
