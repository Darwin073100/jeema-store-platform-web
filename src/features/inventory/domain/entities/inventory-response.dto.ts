import { LotEntity } from "../../../lot/domain/entities/lot.entity";
import { ProductEntity } from "../../../product/domain/entities/product.entity";
import { InventoryItemEntity } from "./inventory-item-response.dto";

export interface InventoryResponseDTO{
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
    product?          : ProductEntity|null,
    lot?              : LotEntity | null,
    inventoryItems?   : InventoryItemEntity[] | null
}