import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { PurchasePriceVO } from "../value-objects/purchase-price.vo";
import { LotPurchaseQuantityVO } from "../value-objects/lot-purchase-quantity.vo";
import { LotEntity } from "./lot.entity";
import { LotUnitsInPurchaseUnitVO } from "../value-objects/lot-units-in-purchase-unit.vo";

export class LotUnitPurchaseEntity {
    private readonly _lotUnitPurchaseId: bigint;
    private _lotId: bigint;
    private _purchasePrice: PurchasePriceVO;
    private _purchaseQuantity: LotPurchaseQuantityVO;
    private _unit: ForSaleEnum;
    private _unitsInPurchaseUnit: LotUnitsInPurchaseUnitVO;
    private readonly _createdAt: Date;
    private _updatedAt?: Date | null;
    private _deletedAt?: Date | null;
    private _lot?: LotEntity | null;

    constructor(
        lotUnitPurchaseId: bigint,
        lotId: bigint,
        purchasePrice: PurchasePriceVO,
        purchaseQuantity: LotPurchaseQuantityVO,
        unit: ForSaleEnum,
        unitsInPurchaseUnit: LotUnitsInPurchaseUnitVO,
        createdAt: Date,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
        lot?: LotEntity | null,
    ) {
        this._lotUnitPurchaseId = lotUnitPurchaseId;
        this._lotId = lotId;
        this._purchasePrice = purchasePrice;
        this._purchaseQuantity = purchaseQuantity;
        this._unit = unit;
        this._unitsInPurchaseUnit = unitsInPurchaseUnit;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._lot = lot;
    }

    static create(
        lotId: bigint,
        purchasePrice: PurchasePriceVO,
        purchaseQuantity: LotPurchaseQuantityVO,
        unit: ForSaleEnum,
        unitsInPurchaseUnit: LotUnitsInPurchaseUnitVO,
    ) {
        const lotUnitPurchaseEntity = new LotUnitPurchaseEntity(
            BigInt(new Date().getTime()),
            lotId,
            purchasePrice,
            purchaseQuantity,
            unit,
            unitsInPurchaseUnit,
            new Date(),
            null,
            null,
            null
        );
        return lotUnitPurchaseEntity;
    }

    static reconstitute(
        lotUnitPurchaseId: bigint,
        lotId: bigint,
        purchasePrice: PurchasePriceVO,
        purchaseQuantity: LotPurchaseQuantityVO,
        unit: ForSaleEnum,
        unitsInPurchaseUnit: LotUnitsInPurchaseUnitVO,
        createdAt: Date,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
        lot?: LotEntity | null,
    ) {
        const lotUnitPurchaseEntity = new LotUnitPurchaseEntity(
            lotUnitPurchaseId,
            lotId,
            purchasePrice,
            purchaseQuantity,
            unit,
            unitsInPurchaseUnit,
            createdAt,
            updatedAt,
            deletedAt,
            lot
        );
        return lotUnitPurchaseEntity;
    }

    get lotUnitPurchaseId(): bigint {
        return this._lotUnitPurchaseId;
    }
    get lotId(): bigint {
        return this._lotId;
    }
    get purchasePrice(): PurchasePriceVO {
        return this._purchasePrice;
    }
    get purchaseQuantity(): LotPurchaseQuantityVO {
        return this._purchaseQuantity;
    }
    get unit(): ForSaleEnum {
        return this._unit;
    }
    get unitsInPurchaseUnit(): LotUnitsInPurchaseUnitVO{
        return this._unitsInPurchaseUnit;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date | null | undefined {
        return this._updatedAt;
    }
    get deletedAt(): Date | null | undefined {
        return this._deletedAt;
    }
    get lot(): LotEntity|undefined|null{
        return this._lot;
    }

}