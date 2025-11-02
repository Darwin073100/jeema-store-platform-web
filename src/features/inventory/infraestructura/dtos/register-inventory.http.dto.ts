export interface RegisterInventoryHttpDTO {
    productId            : string;
    branchOfficeId       : string;
    isSellable           : boolean;
    internalBarCode?     : string | null;
    salePriceOne?        : number | null;
    salePriceMany?       : number | null;
    saleQuantityMany?    : number | null;
    salePriceSpecial?    : number | null;
    minStockBranch?      : number | null;
    maxStockBranch?      : number | null;
}