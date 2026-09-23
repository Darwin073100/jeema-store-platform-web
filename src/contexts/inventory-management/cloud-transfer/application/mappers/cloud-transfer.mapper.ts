import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { ICloudTransfer } from "../../presentation/interfaces/ICloudTransfer";
import { ICloudTransferItem } from "../../presentation/interfaces/ICloudTransferItem";

export class CloudTransferMapper {
    static itemToIResponse(item: CloudTransferItemEntity): ICloudTransferItem {
        const dto: ICloudTransferItem = {
            cloudTransferItemId: item.cloudTransferItemId,
            cloudTransferId: item.cloudTransferId,
            lineNumber: item.lineNumber,
            originLocalProductId: item.originLocalProductId,
            originLocalLotId: item.originLocalLotId,
            originLocalInventoryItemId: item.originLocalInventoryItemId,
            productUniversalBarCode: item.productUniversalBarCode,
            productName: item.productName,
            productSku: item.productSku,
            productCategoryName: item.productCategoryName,
            productCategoryDescription: item.productCategoryDescription,
            productBrandName: item.productBrandName,
            productDescription: item.productDescription,
            productUnitOfMeasure: item.productUnitOfMeasure,
            productImageUrl: item.productImageUrl,
            lotNumber: item.lotNumber,
            lotPurchasePrice: item.lotPurchasePrice,
            lotPurchaseUnit: item.lotPurchaseUnit,
            lotTransferredQuantity: item.lotTransferredQuantity,
            lotExpirationDate: item.lotExpirationDate,
            lotManufacturingDate: item.lotManufacturingDate,
            lotOriginReceivedDate: item.lotOriginReceivedDate,
            lotSupplierName: item.lotSupplierName,
            inventorySuggestedSalePriceOne: item.inventorySuggestedSalePriceOne,
            inventorySuggestedSalePriceMany: item.inventorySuggestedSalePriceMany,
            inventorySuggestedSaleQuantityMany: item.inventorySuggestedSaleQuantityMany,
            inventorySuggestedSalePriceSpecial: item.inventorySuggestedSalePriceSpecial,
            inventoryOriginQuantityOnHand: item.inventoryOriginQuantityOnHand,
            inventorySuggestedLocation: item.inventorySuggestedLocation,
            resolutionStatus: item.resolutionStatus,
            matchedLocalProductId: item.matchedLocalProductId,
            matchedLocalCategoryId: item.matchedLocalCategoryId,
            matchedLocalInventoryId: item.matchedLocalInventoryId,
            matchedLocalLotId: item.matchedLocalLotId,
            matchedLocalInventoryItemId: item.matchedLocalInventoryItemId,
            autoMatchedByBarcode: item.autoMatchedByBarcode,
            rejectionReason: item.rejectionReason,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
        return dto;
    }

    static toIResponse(transfer: CloudTransferEntity): ICloudTransfer {
        const dto: ICloudTransfer = {
            cloudTransferId: transfer.cloudTransferId,
            remoteCloudTransferId: transfer.remoteCloudTransferId,
            direction: transfer.direction,
            fromBranchOfficeId: transfer.fromBranchOfficeId,
            fromCloudBranchOfficeId: transfer.fromCloudBranchOfficeId,
            toBranchOfficeId: transfer.toBranchOfficeId,
            toCloudBranchOfficeId: transfer.toCloudBranchOfficeId,
            status: transfer.status,
            shipmentNotes: transfer.shipmentNotes,
            resolutionNotes: transfer.resolutionNotes,
            errorMessage: transfer.errorMessage,
            requestedByEmployeeId: transfer.requestedByEmployeeId,
            processedByEmployeeId: transfer.processedByEmployeeId,
            lastSyncedAt: transfer.lastSyncedAt,
            createdAt: transfer.createdAt,
            updatedAt: transfer.updatedAt,
            items: transfer.items.map(item => this.itemToIResponse(item)),
        };
        return dto;
    }
}
