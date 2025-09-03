export interface RegisterInventoryDTO {
    productId            : bigint;
    lotId                : bigint;
    branchOfficeId       : bigint;
    isSellable           : boolean;
    internalBarCode?     : string | null;
    salePriceOne?        : number | null;
    salePriceMany?       : number | null;
    saleQuantityMany?    : number | null;
    salePriceSpecial?    : number | null;
    minStockBranch?      : number | null;
    maxStockBranch?      : number | null;
}