import { LotUnitPurchaseEntity } from "src/contexts/purchase-management/lot/domain/entities/lot-unit-purchase.entity";
import { LotUnitPurchaseOrmEntity } from "../entities/lot-unit-purchase.orm-entity";
import { PurchasePriceVO } from "src/contexts/purchase-management/lot/domain/value-objects/purchase-price.vo";
import { LotPurchaseQuantityVO } from "src/contexts/purchase-management/lot/domain/value-objects/lot-purchase-quantity.vo";
import { LotMapper } from "./lot.mapper";
import { LotUnitsInPurchaseUnitVO } from "src/contexts/purchase-management/lot/domain/value-objects/lot-units-in-purchase-unit.vo";

export class LotUnitPurchaseMapper{
    static toDomain(ormEntity: LotUnitPurchaseOrmEntity){
        const lotUnitPurchase = LotUnitPurchaseEntity.reconstitute(
            ormEntity.lotUnitPurchaseId,
            ormEntity.lotId,
            PurchasePriceVO.create(ormEntity.purchasePrice),
            LotPurchaseQuantityVO.create(ormEntity.purchaseQuantity),
            ormEntity.unit,
            LotUnitsInPurchaseUnitVO.create(ormEntity.unitsInPurchaseUnit),
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.lot ? LotMapper.toDomain(ormEntity.lot) : null
        )
        return lotUnitPurchase;
    }

    static toOrmEntity(domainEntity: LotUnitPurchaseEntity): LotUnitPurchaseOrmEntity {
        const ormEntity = new LotUnitPurchaseOrmEntity();
        ormEntity.lotUnitPurchaseId = domainEntity.lotUnitPurchaseId;
        ormEntity.lotId = domainEntity.lotId;
        ormEntity.purchasePrice = domainEntity.purchasePrice.value;
        ormEntity.purchaseQuantity = domainEntity.purchaseQuantity.value;
        ormEntity.unit = domainEntity.unit;
        ormEntity.unitsInPurchaseUnit = domainEntity.unitsInPurchaseUnit.value;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        ormEntity.lot = domainEntity.lot ? LotMapper.toOrm(domainEntity.lot) : null;
        return ormEntity;
    }
}