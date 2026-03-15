import { ProductMapper } from "src/contexts/product-management/product/application/mappers/product.mapper";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryResponseDto } from "../dtos/inventory-response.dto";
import { InventoryItemMapper } from "src/contexts/inventory-management/inventory-item/application/mapper/inventory-item.mapper";
import { IInventory } from "../../presentation/interfaces/IInventory";
import { BranchOfficeMapper } from "@/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";

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
            internalBarCode: entity.internalBarCode?.value ?? null,
            salePriceOne: entity.salePriceOne?.value ?? null,
            salePriceMany: entity.salePriceMany?.value ?? null,
            saleQuantityMany: entity.saleQuantityMany?.value ?? null,
            salePriceSpecial: entity.salePriceSpecial?.value ?? null,
            minStockBranch: entity.minStockBranch?.value ?? null,
            maxStockBranch: entity.maxStockBranch?.value ?? null,
            updatedAt: entity.updatedAt ?? null,
            deletedAt: entity.deletedAt ?? null,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toIResponse(entity.branchOffice): null,
            product: entity.product? ProductMapper.toIResponse(entity.product) : null,
            inventoryItems: entity.inventoryItems ? entity.inventoryItems?.map(item => InventoryItemMapper.toIResponse(item)): [],
        };
        return inventory;
    }
}
