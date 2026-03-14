import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

export interface IInventory{
    inventoryId       : bigint;
    productId         : bigint;
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
    product?          : IProduct|null;
    inventoryItems?   : any[] | null;
}