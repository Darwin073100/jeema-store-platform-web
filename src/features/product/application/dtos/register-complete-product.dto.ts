import { ForSaleEnum } from "../../domain/enums/for-sale.enum";
import { RegisterLotUnitPurchaseDTO } from "@/features/lot/application/dtos/register-lot-unit-purchase.dto";

export interface RCPInventoryItemDTO {
    location: string;
    quantityOnHand: number;
    lastStockedAt: Date;
    purchasePriceAtStock: number;
}

export interface RCPInventory{
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
    inventoryItems?: RCPInventoryItemDTO[] | null;
}

export interface RCPLot{
    // Lot
    lotNumber: string;
    purchasePrice: number;
    initialQuantity: number;
    purchaseUnit: ForSaleEnum;
    expirationDate?: Date | null;
    manufacturingDate?: Date | null;
    receivedDate: Date;
    lotUnitPurchases?: RegisterLotUnitPurchaseDTO[] | null;
}

export interface RegisterCompleteProductDTO {
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
    inventory: RCPInventory | null;
    lot: RCPLot | null;
}