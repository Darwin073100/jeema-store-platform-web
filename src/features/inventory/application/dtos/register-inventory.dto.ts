export interface RegisterInventoryDTO {
    productId            : bigint;
    lotId                : bigint;
    branchOfficeId       : bigint;
    isSellable           : boolean;
    salePriceOne?        : number | null;
    salePriceMany?       : number | null;
    saleQuantityMany?    : number | null;
    salePriceSpecial?    : number | null;
    minStockBranch?      : number | null;
    maxStockBranch?      : number | null;
}