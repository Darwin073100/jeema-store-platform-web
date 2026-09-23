import { CloudTransferItemEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer-item.entity";
import { CloudTransferItemResolutionStatusEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferItemAlreadyResolvedException } from "@/contexts/inventory-management/cloud-transfer/domain/exceptions/cloud-transfer-item-already-resolved.exception";
import { CloudTransferItemNotResolvedException } from "@/contexts/inventory-management/cloud-transfer/domain/exceptions/cloud-transfer-item-not-resolved.exception";
import { InvalidCloudTransferException } from "@/contexts/inventory-management/cloud-transfer/domain/exceptions/invalid-cloud-transfer.exception";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

function buildItem() {
    return CloudTransferItemEntity.create({
        cloudTransferId: BigInt(1),
        lineNumber: 1,
        productUniversalBarCode: '7501234567890',
        productName: 'Producto de prueba',
        productSku: null,
        productCategoryName: 'Categoria',
        productUnitOfMeasure: ForSaleEnum.PC,
        lotNumber: 'LOTE-1',
        lotPurchasePrice: 10,
        lotPurchaseUnit: ForSaleEnum.PC,
        lotTransferredQuantity: 5,
    });
}

describe('CloudTransferItemEntity', () => {
    it('create() arranca en PENDING, sin auto-match', () => {
        const item = buildItem();
        expect(item.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.PENDING);
        expect(item.autoMatchedByBarcode).toBe(false);
        expect(item.matchedLocalProductId).toBeNull();
    });

    it('lotTransferredQuantity <= 0 lanza InvalidCloudTransferException', () => {
        expect(() => CloudTransferItemEntity.create({
            cloudTransferId: BigInt(1),
            lineNumber: 1,
            productUniversalBarCode: null,
            productName: 'x',
            productSku: null,
            productCategoryName: 'y',
            productUnitOfMeasure: ForSaleEnum.PC,
            lotNumber: 'L1',
            lotPurchasePrice: 1,
            lotPurchaseUnit: ForSaleEnum.PC,
            lotTransferredQuantity: 0,
        })).toThrow(InvalidCloudTransferException);
    });

    it('autoMatchByBarcode() pasa a MATCHED con autoMatchedByBarcode=true', () => {
        const item = buildItem();
        item.autoMatchByBarcode(BigInt(50), BigInt(60));
        expect(item.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.MATCHED);
        expect(item.autoMatchedByBarcode).toBe(true);
        expect(item.matchedLocalProductId).toBe(BigInt(50));
        expect(item.matchedLocalInventoryId).toBe(BigInt(60));
    });

    it('resolveAsExistingProduct() pasa a MATCHED con autoMatchedByBarcode=false', () => {
        const item = buildItem();
        item.resolveAsExistingProduct(BigInt(50), null);
        expect(item.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.MATCHED);
        expect(item.autoMatchedByBarcode).toBe(false);
    });

    it('resolveAsNewProduct() pasa a NEW_PRODUCT con categoría asignada', () => {
        const item = buildItem();
        item.resolveAsNewProduct(BigInt(70), BigInt(80), BigInt(90));
        expect(item.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.NEW_PRODUCT);
        expect(item.matchedLocalCategoryId).toBe(BigInt(80));
    });

    it('reject() pasa a REJECTED con motivo', () => {
        const item = buildItem();
        item.reject('duplicado, ya lo tenemos');
        expect(item.resolutionStatus).toBe(CloudTransferItemResolutionStatusEnum.REJECTED);
        expect(item.rejectionReason).toBe('duplicado, ya lo tenemos');
    });

    it('no permite resolver dos veces sin pasar por un "deshacer" (no incluido en v1)', () => {
        const item = buildItem();
        item.resolveAsExistingProduct(BigInt(1), null);
        expect(() => item.resolveAsExistingProduct(BigInt(2), null)).toThrow(CloudTransferItemAlreadyResolvedException);
        expect(() => item.autoMatchByBarcode(BigInt(2), null)).toThrow(CloudTransferItemAlreadyResolvedException);
        expect(() => item.resolveAsNewProduct(BigInt(2), BigInt(3), BigInt(4))).toThrow(CloudTransferItemAlreadyResolvedException);
        expect(() => item.reject('tarde')).toThrow(CloudTransferItemAlreadyResolvedException);
    });

    it('attachApprovedStock() exige que el item ya esté MATCHED o NEW_PRODUCT', () => {
        const pendingItem = buildItem();
        expect(() => pendingItem.attachApprovedStock(BigInt(1), BigInt(2)))
            .toThrow(CloudTransferItemNotResolvedException);

        const matchedItem = buildItem();
        matchedItem.resolveAsExistingProduct(BigInt(1), null);
        matchedItem.attachApprovedStock(BigInt(10), BigInt(20));
        expect(matchedItem.matchedLocalLotId).toBe(BigInt(10));
        expect(matchedItem.matchedLocalInventoryItemId).toBe(BigInt(20));

        const rejectedItem = buildItem();
        rejectedItem.reject('no aplica');
        expect(() => rejectedItem.attachApprovedStock(BigInt(1), BigInt(2)))
            .toThrow(CloudTransferItemNotResolvedException);
    });
});
