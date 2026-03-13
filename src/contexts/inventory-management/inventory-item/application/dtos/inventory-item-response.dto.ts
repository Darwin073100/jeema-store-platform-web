import { InventoryResponseDto } from "src/contexts/inventory-management/inventory/application/dtos/inventory-response.dto";
import { LocationEnum } from "../../domain/enums/location.enum";

export class InventoryItemResponseDto {
    readonly inventoryItemId      : string;
    readonly inventoryId          : string;
    readonly location             : LocationEnum;
    readonly quantityOnHan        : number;
    readonly lastStockedAt        : Date;
    readonly purchasePriceAtStock : number;
    readonly internalBarCode?     : string | null;
    readonly createdAt            : Date;
    readonly updatedAt?           : Date|null;
    readonly deletedAt?           : Date|null;
    readonly inventory?           : InventoryResponseDto|null;

    constructor(
        inventoryItemId      : string,
        inventoryId            : string,
        location             : LocationEnum,
        quantityOnHan        : number,
        lastStockedAt        : Date,
        purchasePriceAtStock : number,
        createdAt            : Date,
        internalBarCode?     : string | null,
        updatedAt?           : Date|null,
        deletedAt?           : Date|null,
        inventory?           : InventoryResponseDto|null,
    ) {
        this.inventoryItemId      = inventoryItemId;
        this.createdAt            = createdAt;
        this.inventoryId            = inventoryId;
        this.location             = location;
        this.quantityOnHan        = quantityOnHan;
        this.lastStockedAt        = lastStockedAt;
        this.purchasePriceAtStock = purchasePriceAtStock;
        this.internalBarCode      = internalBarCode ?? null;
        this.updatedAt            = updatedAt ?? null;
        this.deletedAt            = deletedAt ?? null;
        this.inventory             = inventory ?? null;
    }

}