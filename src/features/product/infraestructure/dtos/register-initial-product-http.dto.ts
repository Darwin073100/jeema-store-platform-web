import { ForSaleEnum } from "../../domain/enums/for-sale.enum";
import { RegisterLotUnitPurchaseHttpDTO } from "@/features/lot/infraestructure/dtos/register-lot-unit-purchase-http.dto";

export interface InventoryItemHttpDTO {
    location: string;
    quantityOnHand: number;
    lastStockedAt: string;
    purchasePriceAtStock: number;
}

export interface RegisterInitialProductHttpDTO {
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
    
    // Lot
    lotNumber: string;
    purchasePrice: number;
    initialQuantity: number;
    purchaseUnit: ForSaleEnum;
    expirationDate?: string | null;
    manufacturingDate?: string | null;
    receivedDate: string;
    lotUnitPurchases?: RegisterLotUnitPurchaseHttpDTO[] | null;
    
    // InventoryItem
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
    inventoryItems?: InventoryItemHttpDTO[] | null;
}