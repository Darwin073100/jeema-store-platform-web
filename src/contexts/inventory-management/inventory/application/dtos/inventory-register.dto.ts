import { InventoryItemRegisterDto } from "src/contexts/inventory-management/inventory-item/application/dtos/inventory-item-register.dto";

export interface InventoryRegisterDto {
    readonly productId         : bigint;
    readonly branchOfficeId    : bigint;
    readonly isSellable        : boolean;
    readonly internalBarCode?  : string | null;
    readonly salePriceOne?     : number | null;
    readonly salePriceMany?    : number | null;
    readonly saleQuantityMany? : number | null;
    readonly salePriceSpecial? : number | null;
    readonly minStockBranch?   : number | null;
    readonly maxStockBranch?   : number | null;
    readonly inventoryItems?   : InventoryItemRegisterDto[] | null;
}