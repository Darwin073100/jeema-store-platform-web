/**
 * Forma exacta del wire body de `POST /cloud-transfers`, confirmada contra
 * `http://localhost:3001/api/docs-json` (schemas `CreateCloudTransferCommand`/`TransferItemCommand`/
 * `ProductBlockCommand`/`LotBlockCommand`/`InventoryBlockCommand`).
 */
export interface ProductBlockHttpDto {
    universalBarCode?: string;
    name: string;
    sku?: string;
    categoryName: string;
    categoryDescription?: string;
    brandName?: string;
    description?: string;
    unitOfMeasure: string; // valores ForSaleEnum
    imageUrl?: string;
}

export interface LotBlockHttpDto {
    lotNumber: string;
    purchasePrice: string; // decimal-como-string
    purchaseUnit: string; // valores ForSaleEnum
    transferredQuantity: string; // decimal-como-string
    expirationDate?: string;
    manufacturingDate?: string;
    originReceivedDate?: string;
    supplierName?: string;
}

export interface InventoryBlockHttpDto {
    suggestedSalePriceOne?: string;
    suggestedSalePriceMany?: string;
    suggestedSaleQuantityMany?: string;
    suggestedSalePriceSpecial?: string;
    originQuantityOnHand?: string;
    suggestedLocation?: string; // valores LocationEnum
}

export interface TransferItemHttpDto {
    originLocalProductId: string;
    originLocalLotId?: string;
    originLocalInventoryItemId?: string;
    product: ProductBlockHttpDto;
    lot: LotBlockHttpDto;
    inventory: InventoryBlockHttpDto;
}

export interface CreateCloudTransferHttpDto {
    fromCloudBranchId: string;
    toCloudBranchId: string;
    localTransferId: string;
    shipmentNotes?: string; // maxLength 500
    items: TransferItemHttpDto[];
}
