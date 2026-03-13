import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { RegisterLotUnitPurchaseDTO } from "src/contexts/purchase-management/lot/application/dtos/register-lot-unit-purchase.dto";
import { InventoryItemRegisterDto } from "src/contexts/inventory-management/inventory-item/application/dtos/inventory-item-register.dto";

export class RegisterProductWhitLotAndInventoryDto {
    // InventoryItem
    branchOfficeId    : bigint;
    internalBarCode?  : string | null;
    isSellable        : boolean;
    salePriceOne?     : number | null;
    salePriceMany?    : number | null;
    saleQuantityMany? : number | null;
    salePriceSpecial? : number | null;
    minStockBranch?   : number | null;
    maxStockBranch?   : number | null;
    inventoryItems?   : InventoryItemRegisterDto[]|null;
    // Lot
    lotNumber          : string;
    purchasePrice      : number;
    initialQuantity    : number;
    purchaseUnit       : ForSaleEnum;
    expirationDate?    : Date | null;
    manufacturingDate? : Date | null;
    receivedDate       : Date;
    lotUnitPurchases?  : RegisterLotUnitPurchaseDTO[] | null;
    // Product
    establishmentId   : bigint;
    categoryId        : bigint;
    brandId?          : bigint | null = null;
    seasonId?         : bigint | null;
    name              : string;
    sku?              : string | null;
    universalBarCode? : string | null;
    description?      : string | null;
    unitOfMeasure     : string;
    minStockGlobal    : number;
    imageUrl?         : string | null;
}