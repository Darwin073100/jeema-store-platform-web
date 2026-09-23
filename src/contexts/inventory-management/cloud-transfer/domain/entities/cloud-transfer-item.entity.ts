import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { CloudTransferItemResolutionStatusEnum } from "../enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferItemQuantityVO } from "../value-objets/cloud-transfer-item-quantity.vo";
import { CloudTransferItemAlreadyResolvedException } from "../exceptions/cloud-transfer-item-already-resolved.exception";
import { CloudTransferItemNotResolvedException } from "../exceptions/cloud-transfer-item-not-resolved.exception";

/**
 * Entidad hija de `CloudTransferEntity`: 1 fila por producto transferido. Guarda un snapshot completo del
 * producto/lote/inventario de origen (A) + los campos de resolución del lado destino (B).
 * Ver spect/08_cloud_transfer_spect.md sección 3.5/3.6 para el razonamiento de cada campo.
 */
export class CloudTransferItemEntity {
    private readonly _cloudTransferItemId: bigint;
    private _cloudTransferId: bigint;
    private _lineNumber: number;

    // Referencias al origen en A (null cuando esta fila es un espejo recibido en B)
    private _originLocalProductId: bigint | null;
    private _originLocalLotId: bigint | null;
    private _originLocalInventoryItemId: bigint | null;

    // Snapshot de producto
    private _productUniversalBarCode: string | null;
    private _productName: string;
    private _productSku: string | null;
    private _productCategoryName: string;
    private _productCategoryDescription: string | null;
    private _productBrandName: string | null;
    private _productDescription: string | null;
    private _productUnitOfMeasure: ForSaleEnum;
    private _productImageUrl: string | null;

    // Snapshot de lote
    private _lotNumber: string;
    private _lotPurchasePrice: number;
    private _lotPurchaseUnit: ForSaleEnum;
    private _lotTransferredQuantity: CloudTransferItemQuantityVO;
    private _lotExpirationDate: Date | null;
    private _lotManufacturingDate: Date | null;
    private _lotOriginReceivedDate: Date | null;
    private _lotSupplierName: string | null;

    // Snapshot de inventario (sugerencias)
    private _inventorySuggestedSalePriceOne: number | null;
    private _inventorySuggestedSalePriceMany: number | null;
    private _inventorySuggestedSaleQuantityMany: number | null;
    private _inventorySuggestedSalePriceSpecial: number | null;
    private _inventoryOriginQuantityOnHand: number | null;
    private _inventorySuggestedLocation: LocationEnum | null;

    // Resolución del lado B
    private _resolutionStatus: CloudTransferItemResolutionStatusEnum;
    private _matchedLocalProductId: bigint | null;
    private _matchedLocalCategoryId: bigint | null;
    private _matchedLocalInventoryId: bigint | null;
    private _matchedLocalLotId: bigint | null;
    private _matchedLocalInventoryItemId: bigint | null;
    private _autoMatchedByBarcode: boolean;
    private _rejectionReason: string | null;

    private readonly _createdAt: Date;
    private _updatedAt: Date | null;

    private constructor(
        cloudTransferItemId: bigint,
        cloudTransferId: bigint,
        lineNumber: number,
        originLocalProductId: bigint | null,
        originLocalLotId: bigint | null,
        originLocalInventoryItemId: bigint | null,
        productUniversalBarCode: string | null,
        productName: string,
        productSku: string | null,
        productCategoryName: string,
        productCategoryDescription: string | null,
        productBrandName: string | null,
        productDescription: string | null,
        productUnitOfMeasure: ForSaleEnum,
        productImageUrl: string | null,
        lotNumber: string,
        lotPurchasePrice: number,
        lotPurchaseUnit: ForSaleEnum,
        lotTransferredQuantity: number,
        lotExpirationDate: Date | null,
        lotManufacturingDate: Date | null,
        lotOriginReceivedDate: Date | null,
        lotSupplierName: string | null,
        inventorySuggestedSalePriceOne: number | null,
        inventorySuggestedSalePriceMany: number | null,
        inventorySuggestedSaleQuantityMany: number | null,
        inventorySuggestedSalePriceSpecial: number | null,
        inventoryOriginQuantityOnHand: number | null,
        inventorySuggestedLocation: LocationEnum | null,
        resolutionStatus: CloudTransferItemResolutionStatusEnum,
        matchedLocalProductId: bigint | null,
        matchedLocalCategoryId: bigint | null,
        matchedLocalInventoryId: bigint | null,
        matchedLocalLotId: bigint | null,
        matchedLocalInventoryItemId: bigint | null,
        autoMatchedByBarcode: boolean,
        rejectionReason: string | null,
        createdAt: Date,
        updatedAt: Date | null,
    ) {
        this._cloudTransferItemId = cloudTransferItemId;
        this._cloudTransferId = cloudTransferId;
        this._lineNumber = lineNumber;
        this._originLocalProductId = originLocalProductId;
        this._originLocalLotId = originLocalLotId;
        this._originLocalInventoryItemId = originLocalInventoryItemId;
        this._productUniversalBarCode = productUniversalBarCode;
        this._productName = productName;
        this._productSku = productSku;
        this._productCategoryName = productCategoryName;
        this._productCategoryDescription = productCategoryDescription;
        this._productBrandName = productBrandName;
        this._productDescription = productDescription;
        this._productUnitOfMeasure = productUnitOfMeasure;
        this._productImageUrl = productImageUrl;
        this._lotNumber = lotNumber;
        this._lotPurchasePrice = lotPurchasePrice;
        this._lotPurchaseUnit = lotPurchaseUnit;
        this._lotTransferredQuantity = CloudTransferItemQuantityVO.create(lotTransferredQuantity);
        this._lotExpirationDate = lotExpirationDate;
        this._lotManufacturingDate = lotManufacturingDate;
        this._lotOriginReceivedDate = lotOriginReceivedDate;
        this._lotSupplierName = lotSupplierName;
        this._inventorySuggestedSalePriceOne = inventorySuggestedSalePriceOne;
        this._inventorySuggestedSalePriceMany = inventorySuggestedSalePriceMany;
        this._inventorySuggestedSaleQuantityMany = inventorySuggestedSaleQuantityMany;
        this._inventorySuggestedSalePriceSpecial = inventorySuggestedSalePriceSpecial;
        this._inventoryOriginQuantityOnHand = inventoryOriginQuantityOnHand;
        this._inventorySuggestedLocation = inventorySuggestedLocation;
        this._resolutionStatus = resolutionStatus;
        this._matchedLocalProductId = matchedLocalProductId;
        this._matchedLocalCategoryId = matchedLocalCategoryId;
        this._matchedLocalInventoryId = matchedLocalInventoryId;
        this._matchedLocalLotId = matchedLocalLotId;
        this._matchedLocalInventoryItemId = matchedLocalInventoryItemId;
        this._autoMatchedByBarcode = autoMatchedByBarcode;
        this._rejectionReason = rejectionReason;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    static create(params: {
        cloudTransferId: bigint;
        lineNumber: number;
        originLocalProductId?: bigint | null;
        originLocalLotId?: bigint | null;
        originLocalInventoryItemId?: bigint | null;
        productUniversalBarCode: string | null;
        productName: string;
        productSku: string | null;
        productCategoryName: string;
        productCategoryDescription?: string | null;
        productBrandName?: string | null;
        productDescription?: string | null;
        productUnitOfMeasure: ForSaleEnum;
        productImageUrl?: string | null;
        lotNumber: string;
        lotPurchasePrice: number;
        lotPurchaseUnit: ForSaleEnum;
        lotTransferredQuantity: number;
        lotExpirationDate?: Date | null;
        lotManufacturingDate?: Date | null;
        lotOriginReceivedDate?: Date | null;
        lotSupplierName?: string | null;
        inventorySuggestedSalePriceOne?: number | null;
        inventorySuggestedSalePriceMany?: number | null;
        inventorySuggestedSaleQuantityMany?: number | null;
        inventorySuggestedSalePriceSpecial?: number | null;
        inventoryOriginQuantityOnHand?: number | null;
        inventorySuggestedLocation?: LocationEnum | null;
    }): CloudTransferItemEntity {
        return new CloudTransferItemEntity(
            BigInt(0),
            params.cloudTransferId,
            params.lineNumber,
            params.originLocalProductId ?? null,
            params.originLocalLotId ?? null,
            params.originLocalInventoryItemId ?? null,
            params.productUniversalBarCode,
            params.productName,
            params.productSku,
            params.productCategoryName,
            params.productCategoryDescription ?? null,
            params.productBrandName ?? null,
            params.productDescription ?? null,
            params.productUnitOfMeasure,
            params.productImageUrl ?? null,
            params.lotNumber,
            params.lotPurchasePrice,
            params.lotPurchaseUnit,
            params.lotTransferredQuantity,
            params.lotExpirationDate ?? null,
            params.lotManufacturingDate ?? null,
            params.lotOriginReceivedDate ?? null,
            params.lotSupplierName ?? null,
            params.inventorySuggestedSalePriceOne ?? null,
            params.inventorySuggestedSalePriceMany ?? null,
            params.inventorySuggestedSaleQuantityMany ?? null,
            params.inventorySuggestedSalePriceSpecial ?? null,
            params.inventoryOriginQuantityOnHand ?? null,
            params.inventorySuggestedLocation ?? null,
            CloudTransferItemResolutionStatusEnum.PENDING,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            new Date(),
            null,
        );
    }

    static reconstitute(params: {
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
    }): CloudTransferItemEntity {
        return new CloudTransferItemEntity(
            params.cloudTransferItemId,
            params.cloudTransferId,
            params.lineNumber,
            params.originLocalProductId,
            params.originLocalLotId,
            params.originLocalInventoryItemId,
            params.productUniversalBarCode,
            params.productName,
            params.productSku,
            params.productCategoryName,
            params.productCategoryDescription,
            params.productBrandName,
            params.productDescription,
            params.productUnitOfMeasure,
            params.productImageUrl,
            params.lotNumber,
            params.lotPurchasePrice,
            params.lotPurchaseUnit,
            params.lotTransferredQuantity,
            params.lotExpirationDate,
            params.lotManufacturingDate,
            params.lotOriginReceivedDate,
            params.lotSupplierName,
            params.inventorySuggestedSalePriceOne,
            params.inventorySuggestedSalePriceMany,
            params.inventorySuggestedSaleQuantityMany,
            params.inventorySuggestedSalePriceSpecial,
            params.inventoryOriginQuantityOnHand,
            params.inventorySuggestedLocation,
            params.resolutionStatus,
            params.matchedLocalProductId,
            params.matchedLocalCategoryId,
            params.matchedLocalInventoryId,
            params.matchedLocalLotId,
            params.matchedLocalInventoryItemId,
            params.autoMatchedByBarcode,
            params.rejectionReason,
            params.createdAt,
            params.updatedAt,
        );
    }

    // --- Getters ---
    get cloudTransferItemId(): bigint { return this._cloudTransferItemId; }
    get cloudTransferId(): bigint { return this._cloudTransferId; }
    get lineNumber(): number { return this._lineNumber; }
    get originLocalProductId(): bigint | null { return this._originLocalProductId; }
    get originLocalLotId(): bigint | null { return this._originLocalLotId; }
    get originLocalInventoryItemId(): bigint | null { return this._originLocalInventoryItemId; }
    get productUniversalBarCode(): string | null { return this._productUniversalBarCode; }
    get productName(): string { return this._productName; }
    get productSku(): string | null { return this._productSku; }
    get productCategoryName(): string { return this._productCategoryName; }
    get productCategoryDescription(): string | null { return this._productCategoryDescription; }
    get productBrandName(): string | null { return this._productBrandName; }
    get productDescription(): string | null { return this._productDescription; }
    get productUnitOfMeasure(): ForSaleEnum { return this._productUnitOfMeasure; }
    get productImageUrl(): string | null { return this._productImageUrl; }
    get lotNumber(): string { return this._lotNumber; }
    get lotPurchasePrice(): number { return this._lotPurchasePrice; }
    get lotPurchaseUnit(): ForSaleEnum { return this._lotPurchaseUnit; }
    get lotTransferredQuantity(): number { return this._lotTransferredQuantity.value; }
    get lotExpirationDate(): Date | null { return this._lotExpirationDate; }
    get lotManufacturingDate(): Date | null { return this._lotManufacturingDate; }
    get lotOriginReceivedDate(): Date | null { return this._lotOriginReceivedDate; }
    get lotSupplierName(): string | null { return this._lotSupplierName; }
    get inventorySuggestedSalePriceOne(): number | null { return this._inventorySuggestedSalePriceOne; }
    get inventorySuggestedSalePriceMany(): number | null { return this._inventorySuggestedSalePriceMany; }
    get inventorySuggestedSaleQuantityMany(): number | null { return this._inventorySuggestedSaleQuantityMany; }
    get inventorySuggestedSalePriceSpecial(): number | null { return this._inventorySuggestedSalePriceSpecial; }
    get inventoryOriginQuantityOnHand(): number | null { return this._inventoryOriginQuantityOnHand; }
    get inventorySuggestedLocation(): LocationEnum | null { return this._inventorySuggestedLocation; }
    get resolutionStatus(): CloudTransferItemResolutionStatusEnum { return this._resolutionStatus; }
    get matchedLocalProductId(): bigint | null { return this._matchedLocalProductId; }
    get matchedLocalCategoryId(): bigint | null { return this._matchedLocalCategoryId; }
    get matchedLocalInventoryId(): bigint | null { return this._matchedLocalInventoryId; }
    get matchedLocalLotId(): bigint | null { return this._matchedLocalLotId; }
    get matchedLocalInventoryItemId(): bigint | null { return this._matchedLocalInventoryItemId; }
    get autoMatchedByBarcode(): boolean { return this._autoMatchedByBarcode; }
    get rejectionReason(): string | null { return this._rejectionReason; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | null { return this._updatedAt; }

    private assertPending(action: string): void {
        if (this._resolutionStatus !== CloudTransferItemResolutionStatusEnum.PENDING) {
            throw new CloudTransferItemAlreadyResolvedException(
                `No se puede ${action}: el item ya fue resuelto (estado actual: ${this._resolutionStatus}).`,
            );
        }
    }

    public autoMatchByBarcode(matchedLocalProductId: bigint, matchedLocalInventoryId: bigint | null): void {
        this.assertPending('hacer auto-match por código de barras');
        this._matchedLocalProductId = matchedLocalProductId;
        this._matchedLocalInventoryId = matchedLocalInventoryId;
        this._autoMatchedByBarcode = true;
        this._resolutionStatus = CloudTransferItemResolutionStatusEnum.MATCHED;
        this._updatedAt = new Date();
    }

    public resolveAsExistingProduct(matchedLocalProductId: bigint, matchedLocalInventoryId: bigint | null): void {
        this.assertPending('resolver como producto existente');
        this._matchedLocalProductId = matchedLocalProductId;
        this._matchedLocalInventoryId = matchedLocalInventoryId;
        this._autoMatchedByBarcode = false;
        this._resolutionStatus = CloudTransferItemResolutionStatusEnum.MATCHED;
        this._updatedAt = new Date();
    }

    public resolveAsNewProduct(matchedLocalProductId: bigint, matchedLocalCategoryId: bigint, matchedLocalInventoryId: bigint): void {
        this.assertPending('resolver como producto nuevo');
        this._matchedLocalProductId = matchedLocalProductId;
        this._matchedLocalCategoryId = matchedLocalCategoryId;
        this._matchedLocalInventoryId = matchedLocalInventoryId;
        this._autoMatchedByBarcode = false;
        this._resolutionStatus = CloudTransferItemResolutionStatusEnum.NEW_PRODUCT;
        this._updatedAt = new Date();
    }

    public reject(reason: string): void {
        this.assertPending('rechazar');
        this._rejectionReason = reason;
        this._resolutionStatus = CloudTransferItemResolutionStatusEnum.REJECTED;
        this._updatedAt = new Date();
    }

    /** Llamado solo dentro de `ApproveCloudTransferUseCase`, tras crear lote + inventory_item en B. */
    public attachApprovedStock(matchedLocalLotId: bigint, matchedLocalInventoryItemId: bigint): void {
        if (
            this._resolutionStatus !== CloudTransferItemResolutionStatusEnum.MATCHED &&
            this._resolutionStatus !== CloudTransferItemResolutionStatusEnum.NEW_PRODUCT
        ) {
            throw new CloudTransferItemNotResolvedException(
                `No se puede asignar stock a un item en estado ${this._resolutionStatus}; debe estar MATCHED o NewProduct.`,
            );
        }
        this._matchedLocalLotId = matchedLocalLotId;
        this._matchedLocalInventoryItemId = matchedLocalInventoryItemId;
        this._updatedAt = new Date();
    }
}
