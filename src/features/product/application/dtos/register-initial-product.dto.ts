import { LocationEnum } from "@/features/inventory/domain/enums/location.enum";
import { ForSaleEnum } from "../../domain/enums/for-sale.enum";
import { LotUnitPurchaseEntity } from "@/features/lot/domain/entities/lot-unit-purchase.entity";
import { RegisterLotUnitPurchaseDTO } from "@/features/lot/application/dtos/register-lot-unit-purchase.dto";

export interface InventoryItemDTO {
    location: string;
    quantityOnHand: number;
    lastStockedAt: Date;
    purchasePriceAtStock: number;
}

export interface RegisterInitialProductDTO {
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
    expirationDate?: Date | null;
    manufacturingDate?: Date | null;
    receivedDate: Date;
    lotUnitPurchases?: RegisterLotUnitPurchaseDTO[] | null;
    
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
    inventoryItems?: InventoryItemDTO[] | null;
}