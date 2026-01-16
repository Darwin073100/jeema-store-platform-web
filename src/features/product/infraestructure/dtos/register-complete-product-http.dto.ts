import { ForSaleEnum } from "../../domain/enums/for-sale.enum";
import { RegisterLotUnitPurchaseDTO } from "@/features/lot/application/dtos/register-lot-unit-purchase.dto";

export interface RCPInventoryItemHttpDTO {
    location: string;
    quantityOnHand: number;
    lastStockedAt: string;
    purchasePriceAtStock: number;
}

export interface RCPInventoryHttp{
    branchOfficeId: string;
    isSellable: boolean;
    salePriceOne?: number | null;
    salePriceMany?: number | null;
    saleQuantityMany?: number | null;
    salePriceSpecial?: number | null;
    minStockBranch?: number | null;
    maxStockBranch?: number | null;
    internalBarCode?: string|null;
    // Inventory Items array
    inventoryItems?: RCPInventoryItemHttpDTO[] | null;
}

export interface RCPLotHttp{
    // Lot
    suplierId?: string;
    lotNumber: string;
    purchasePrice: number;
    initialQuantity: number;
    purchaseUnit: ForSaleEnum;
    expirationDate?: string | null;
    manufacturingDate?: string | null;
    receivedDate: string;
    lotUnitPurchases?: RegisterLotUnitPurchaseDTO[] | null;
}

export interface RegisterCompleteProductHttpDTO {
    // Product
    establishmentId: string;
    categoryId: string;
    brandId?: string | null;
    seasonId?: string | null;
    name: string;
    sku?: string | null;
    universalBarCode?: string | null;
    description?: string | null;
    unitOfMeasure: string;
    minStockGlobal: number;
    imageUrl?: string | null;
    inventory?: RCPInventoryHttp;
    lot?: RCPLotHttp;
}