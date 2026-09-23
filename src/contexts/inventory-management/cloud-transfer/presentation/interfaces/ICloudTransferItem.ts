import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";
import { LocationEnum } from "@/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";

/** View-model cliente, item. Espeja 1:1 los getters de `CloudTransferItemEntity`. */
export class ICloudTransferItem {
    cloudTransferItemId: bigint;
    cloudTransferId: bigint;
    lineNumber: number;
    originLocalProductId: bigint | null;
    originLocalLotId: bigint | null;
    originLocalInventoryItemId: bigint | null;
    productUniversalBarCode: string | null;
    productName: string;
    productSku: string | null;
    productCategoryName: string;
    productCategoryDescription: string | null;
    productBrandName: string | null;
    productDescription: string | null;
    productUnitOfMeasure: ForSaleEnum;
    productImageUrl: string | null;
    lotNumber: string;
    lotPurchasePrice: number;
    lotPurchaseUnit: ForSaleEnum;
    lotTransferredQuantity: number;
    lotExpirationDate: Date | null;
    lotManufacturingDate: Date | null;
    lotOriginReceivedDate: Date | null;
    lotSupplierName: string | null;
    inventorySuggestedSalePriceOne: number | null;
    inventorySuggestedSalePriceMany: number | null;
    inventorySuggestedSaleQuantityMany: number | null;
    inventorySuggestedSalePriceSpecial: number | null;
    inventoryOriginQuantityOnHand: number | null;
    inventorySuggestedLocation: LocationEnum | null;
    resolutionStatus: CloudTransferItemResolutionStatusEnum;
    matchedLocalProductId: bigint | null;
    matchedLocalCategoryId: bigint | null;
    matchedLocalInventoryId: bigint | null;
    matchedLocalLotId: bigint | null;
    matchedLocalInventoryItemId: bigint | null;
    autoMatchedByBarcode: boolean;
    rejectionReason: string | null;
    createdAt: Date;
    updatedAt: Date | null;
}
