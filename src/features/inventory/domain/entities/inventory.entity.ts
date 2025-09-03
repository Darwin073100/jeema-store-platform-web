import { LotEntity } from "@/features/lot";
import { InventoryItemEntity } from "./inventory-item.entity";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";

export interface InventoryEntity{
    inventoryId       : bigint;
    productId         : bigint;
    lotId             : bigint;
    branchOfficeId    : bigint;
    isSellable        : boolean;
    internalBarCode?  : string | null;
    salePriceOne?     : number | null;
    salePriceMany?    : number | null;
    saleQuantityMany? : number | null;
    salePriceSpecial? : number | null;
    minStockBranch?   : number | null;
    maxStockBranch?   : number | null;
    createdAt         : Date;
    updatedAt?        : Date|null;
    deletedAt?        : Date|null;
    product?          : ProductEntity|null;
    lot?              : LotEntity | null;
    inventoryItems?   : InventoryItemEntity[] | null;
}