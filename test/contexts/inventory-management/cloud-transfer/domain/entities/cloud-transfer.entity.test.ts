import { CloudTransferEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer.entity";
import { CloudTransferItemEntity } from "@/contexts/inventory-management/cloud-transfer/domain/entities/cloud-transfer-item.entity";
import { CloudTransferStatusEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-status.enum";
import { CloudTransferDirectionEnum } from "@/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-direction.enum";
import { CloudTransferInvalidStatusTransitionException } from "@/contexts/inventory-management/cloud-transfer/domain/exceptions/cloud-transfer-invalid-status-transition.exception";
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

function buildOutgoingTransfer() {
    return CloudTransferEntity.create(
        BigInt(1),
        BigInt(10),
        BigInt(20),
        BigInt(100),
        null,
        [buildItem()],
    );
}

describe('CloudTransferEntity', () => {
    it('create() produce un traspaso OUTGOING en PENDING sin remoteCloudTransferId', () => {
        const transfer = buildOutgoingTransfer();
        expect(transfer.status).toBe(CloudTransferStatusEnum.PENDING);
        expect(transfer.direction).toBe(CloudTransferDirectionEnum.OUTGOING);
        expect(transfer.remoteCloudTransferId).toBeNull();
        expect(transfer.toBranchOfficeId).toBeNull();
    });

    it('fromCloudSnapshot() produce un traspaso INCOMING con remoteCloudTransferId fijado', () => {
        const transfer = CloudTransferEntity.fromCloudSnapshot(
            BigInt(999),
            BigInt(10),
            BigInt(20),
            BigInt(55),
            CloudTransferStatusEnum.PENDING,
            null,
            [],
        );
        expect(transfer.direction).toBe(CloudTransferDirectionEnum.INCOMING);
        expect(transfer.remoteCloudTransferId).toBe(BigInt(999));
        expect(transfer.fromBranchOfficeId).toBeNull();
        expect(transfer.toBranchOfficeId).toBe(BigInt(55));
    });

    it('markAsCreatedInCloud() fija remoteCloudTransferId sin cambiar el status', () => {
        const transfer = buildOutgoingTransfer();
        transfer.markAsCreatedInCloud(BigInt(555));
        expect(transfer.remoteCloudTransferId).toBe(BigInt(555));
        expect(transfer.status).toBe(CloudTransferStatusEnum.PENDING);
    });

    it('sigue el ciclo feliz PENDING -> IN_TRANSIT -> RECEIVED -> APPROVED', () => {
        const transfer = buildOutgoingTransfer();
        transfer.markAsCreatedInCloud(BigInt(1));

        transfer.startProcessing(BigInt(200));
        expect(transfer.status).toBe(CloudTransferStatusEnum.IN_TRANSIT);
        expect(transfer.processedByEmployeeId).toBe(BigInt(200));

        transfer.receive(BigInt(200), 'todo llegó bien');
        expect(transfer.status).toBe(CloudTransferStatusEnum.RECEIVED);
        expect(transfer.resolutionNotes).toBe('todo llegó bien');

        transfer.approve(BigInt(200), 'aprobado');
        expect(transfer.status).toBe(CloudTransferStatusEnum.APPROVED);
    });

    it('approve() lanza CloudTransferInvalidStatusTransitionException si el status no es RECEIVED', () => {
        const transfer = buildOutgoingTransfer();
        expect(() => transfer.approve(BigInt(200), null)).toThrow(CloudTransferInvalidStatusTransitionException);
    });

    it('startProcessing() lanza si el status no es PENDING (evita doble-click)', () => {
        const transfer = buildOutgoingTransfer();
        transfer.startProcessing(BigInt(200));
        expect(() => transfer.startProcessing(BigInt(200))).toThrow(CloudTransferInvalidStatusTransitionException);
    });

    it('markError() solo es válido desde IN_TRANSIT, y retryProcessing() solo desde ERROR', () => {
        const transfer = buildOutgoingTransfer();
        expect(() => transfer.markError('fallo de red')).toThrow(CloudTransferInvalidStatusTransitionException);

        transfer.startProcessing(BigInt(200));
        transfer.markError('fallo de red');
        expect(transfer.status).toBe(CloudTransferStatusEnum.ERROR);
        expect(transfer.errorMessage).toBe('fallo de red');

        transfer.retryProcessing();
        expect(transfer.status).toBe(CloudTransferStatusEnum.IN_TRANSIT);
        expect(transfer.errorMessage).toBeNull();
    });

    it('cancel() funciona desde PENDING, IN_TRANSIT o RECEIVED, pero no desde APPROVED', () => {
        const transfer = buildOutgoingTransfer();
        transfer.cancel('ya no se necesita');
        expect(transfer.status).toBe(CloudTransferStatusEnum.CANCELLED);

        const approved = buildOutgoingTransfer();
        approved.startProcessing(BigInt(1));
        approved.receive(BigInt(1), null);
        approved.approve(BigInt(1), null);
        expect(() => approved.cancel('tarde')).toThrow(CloudTransferInvalidStatusTransitionException);
    });

    it('addItem() solo funciona en PENDING', () => {
        const transfer = buildOutgoingTransfer();
        transfer.startProcessing(BigInt(1));
        expect(() => transfer.addItem(buildItem())).toThrow(CloudTransferInvalidStatusTransitionException);
    });

    it('markSynced() actualiza lastSyncedAt sin exigir un status particular', () => {
        const transfer = buildOutgoingTransfer();
        expect(transfer.lastSyncedAt).toBeNull();
        transfer.markSynced();
        expect(transfer.lastSyncedAt).not.toBeNull();
    });
});
