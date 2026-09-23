import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { CloudTransferItemOrmEntity } from "../entities/cloud-transfer-item.orm-entity";

export class CloudTransferItemMapper {
    static toDomain(ormEntity: CloudTransferItemOrmEntity): CloudTransferItemEntity {
        return CloudTransferItemEntity.reconstitute({
            cloudTransferItemId: ormEntity.cloudTransferItemId,
            cloudTransferId: ormEntity.cloudTransferId,
            lineNumber: ormEntity.lineNumber,
            originLocalProductId: ormEntity.originLocalProductId,
            originLocalLotId: ormEntity.originLocalLotId,
            originLocalInventoryItemId: ormEntity.originLocalInventoryItemId,
            productUniversalBarCode: ormEntity.productUniversalBarCode,
            productName: ormEntity.productName,
            productSku: ormEntity.productSku,
            productCategoryName: ormEntity.productCategoryName,
            productCategoryDescription: ormEntity.productCategoryDescription,
            productBrandName: ormEntity.productBrandName,
            productDescription: ormEntity.productDescription,
            productUnitOfMeasure: ormEntity.productUnitOfMeasure,
            productImageUrl: ormEntity.productImageUrl,
            lotNumber: ormEntity.lotNumber,
            lotPurchasePrice: Number(ormEntity.lotPurchasePrice),
            lotPurchaseUnit: ormEntity.lotPurchaseUnit,
            lotTransferredQuantity: Number(ormEntity.lotTransferredQuantity),
            lotExpirationDate: ormEntity.lotExpirationDate,
            lotManufacturingDate: ormEntity.lotManufacturingDate,
            lotOriginReceivedDate: ormEntity.lotOriginReceivedDate,
            lotSupplierName: ormEntity.lotSupplierName,
            inventorySuggestedSalePriceOne: ormEntity.inventorySuggestedSalePriceOne !== null ? Number(ormEntity.inventorySuggestedSalePriceOne) : null,
            inventorySuggestedSalePriceMany: ormEntity.inventorySuggestedSalePriceMany !== null ? Number(ormEntity.inventorySuggestedSalePriceMany) : null,
            inventorySuggestedSaleQuantityMany: ormEntity.inventorySuggestedSaleQuantityMany !== null ? Number(ormEntity.inventorySuggestedSaleQuantityMany) : null,
            inventorySuggestedSalePriceSpecial: ormEntity.inventorySuggestedSalePriceSpecial !== null ? Number(ormEntity.inventorySuggestedSalePriceSpecial) : null,
            inventoryOriginQuantityOnHand: ormEntity.inventoryOriginQuantityOnHand !== null ? Number(ormEntity.inventoryOriginQuantityOnHand) : null,
            inventorySuggestedLocation: ormEntity.inventorySuggestedLocation,
            resolutionStatus: ormEntity.resolutionStatus,
            matchedLocalProductId: ormEntity.matchedLocalProductId,
            matchedLocalCategoryId: ormEntity.matchedLocalCategoryId,
            matchedLocalInventoryId: ormEntity.matchedLocalInventoryId,
            matchedLocalLotId: ormEntity.matchedLocalLotId,
            matchedLocalInventoryItemId: ormEntity.matchedLocalInventoryItemId,
            autoMatchedByBarcode: ormEntity.autoMatchedByBarcode,
            rejectionReason: ormEntity.rejectionReason,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        });
    }

    static toOrmEntity(domainEntity: CloudTransferItemEntity): CloudTransferItemOrmEntity {
        const ormEntity = new CloudTransferItemOrmEntity();
        ormEntity.cloudTransferItemId = domainEntity.cloudTransferItemId;
        ormEntity.cloudTransferId = domainEntity.cloudTransferId;
        ormEntity.lineNumber = domainEntity.lineNumber;
        ormEntity.originLocalProductId = domainEntity.originLocalProductId;
        ormEntity.originLocalLotId = domainEntity.originLocalLotId;
        ormEntity.originLocalInventoryItemId = domainEntity.originLocalInventoryItemId;
        ormEntity.productUniversalBarCode = domainEntity.productUniversalBarCode;
        ormEntity.productName = domainEntity.productName;
        ormEntity.productSku = domainEntity.productSku;
        ormEntity.productCategoryName = domainEntity.productCategoryName;
        ormEntity.productCategoryDescription = domainEntity.productCategoryDescription;
        ormEntity.productBrandName = domainEntity.productBrandName;
        ormEntity.productDescription = domainEntity.productDescription;
        ormEntity.productUnitOfMeasure = domainEntity.productUnitOfMeasure;
        ormEntity.productImageUrl = domainEntity.productImageUrl;
        ormEntity.lotNumber = domainEntity.lotNumber;
        ormEntity.lotPurchasePrice = domainEntity.lotPurchasePrice.toString();
        ormEntity.lotPurchaseUnit = domainEntity.lotPurchaseUnit;
        ormEntity.lotTransferredQuantity = domainEntity.lotTransferredQuantity.toString();
        ormEntity.lotExpirationDate = domainEntity.lotExpirationDate;
        ormEntity.lotManufacturingDate = domainEntity.lotManufacturingDate;
        ormEntity.lotOriginReceivedDate = domainEntity.lotOriginReceivedDate;
        ormEntity.lotSupplierName = domainEntity.lotSupplierName;
        ormEntity.inventorySuggestedSalePriceOne = domainEntity.inventorySuggestedSalePriceOne !== null ? domainEntity.inventorySuggestedSalePriceOne.toString() : null;
        ormEntity.inventorySuggestedSalePriceMany = domainEntity.inventorySuggestedSalePriceMany !== null ? domainEntity.inventorySuggestedSalePriceMany.toString() : null;
        ormEntity.inventorySuggestedSaleQuantityMany = domainEntity.inventorySuggestedSaleQuantityMany !== null ? domainEntity.inventorySuggestedSaleQuantityMany.toString() : null;
        ormEntity.inventorySuggestedSalePriceSpecial = domainEntity.inventorySuggestedSalePriceSpecial !== null ? domainEntity.inventorySuggestedSalePriceSpecial.toString() : null;
        ormEntity.inventoryOriginQuantityOnHand = domainEntity.inventoryOriginQuantityOnHand !== null ? domainEntity.inventoryOriginQuantityOnHand.toString() : null;
        ormEntity.inventorySuggestedLocation = domainEntity.inventorySuggestedLocation;
        ormEntity.resolutionStatus = domainEntity.resolutionStatus;
        ormEntity.matchedLocalProductId = domainEntity.matchedLocalProductId;
        ormEntity.matchedLocalCategoryId = domainEntity.matchedLocalCategoryId;
        ormEntity.matchedLocalInventoryId = domainEntity.matchedLocalInventoryId;
        ormEntity.matchedLocalLotId = domainEntity.matchedLocalLotId;
        ormEntity.matchedLocalInventoryItemId = domainEntity.matchedLocalInventoryItemId;
        ormEntity.autoMatchedByBarcode = domainEntity.autoMatchedByBarcode;
        ormEntity.rejectionReason = domainEntity.rejectionReason;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        return ormEntity;
    }
}
