import { InventoryItemResponseDto } from "src/contexts/inventory-management/inventory-item/application/dtos/inventory-item-response.dto";
import { ProductResponseDto } from "src/contexts/product-management/product/application/dtos/product-response.dto";

export class InventoryResponseDto {
    readonly inventoryId      : bigint;
    readonly productId            : bigint;
    readonly branchOfficeId       : bigint;
    readonly isSellable           : boolean;
    readonly internalBarCode      : string | null;
    readonly salePriceOne?        : number | null;
    readonly salePriceMany?       : number | null;
    readonly saleQuantityMany?    : number | null;
    readonly salePriceSpecial?    : number | null;
    readonly minStockBranch?      : number | null;
    readonly maxStockBranch?      : number | null;
    readonly createdAt            : Date;
    readonly updatedAt?           : Date|null;
    readonly deletedAt?           : Date|null;
    readonly product?             : ProductResponseDto|null;
    readonly inventoryItems?      : InventoryItemResponseDto[] | null;

    constructor(
        inventoryId      : bigint,
        productId            : bigint,
        branchOfficeId       : bigint,
        isSellable           : boolean,
        createdAt            : Date,
        internalBarCode?     : string | null,
        salePriceOne?        : number | null,
        salePriceMany?       : number | null,
        saleQuantityMany?    : number | null,
        salePriceSpecial?    : number | null,
        minStockBranch?      : number | null,
        maxStockBranch?      : number | null,
        updatedAt?           : Date|null,
        deletedAt?           : Date|null,
        product?             : ProductResponseDto|null,
        inventoryItems?      : InventoryItemResponseDto[] | null
    ) {
        this.inventoryId      = inventoryId;
        this.createdAt        = createdAt;
        this.productId        = productId;
        this.branchOfficeId   = branchOfficeId;
        this.isSellable       = isSellable;
        this.internalBarCode  = internalBarCode ?? null;
        this.salePriceOne     = salePriceOne ?? null;
        this.salePriceMany    = salePriceMany ?? null;
        this.saleQuantityMany = saleQuantityMany ?? null;
        this.salePriceSpecial = salePriceSpecial ?? null;
        this.minStockBranch   = minStockBranch ?? null;
        this.maxStockBranch   = maxStockBranch ?? null;
        this.updatedAt        = updatedAt ?? null;
        this.deletedAt        = deletedAt ?? null;
        this.product          = product ?? null;
        this.inventoryItems   = inventoryItems;
    }

}