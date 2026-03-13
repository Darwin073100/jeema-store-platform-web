import { LotOrmEntity } from '../entities/lot.orm-entity';
import { LotEntity } from 'src/contexts/purchase-management/lot/domain/entities/lot.entity';
import { ProductTypeOrmMapper } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper';
import { LotUnitPurchaseMapper } from './lot-unit-purchase.mapper';
import { SuplierMapper } from 'src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/mappers/suplier.mapper';

export class LotMapper {
  static toDomain(entity: LotOrmEntity): LotEntity {
    return LotEntity.reconstitute(
      entity.lotId,
      entity.productId,
      entity.suplierId,
      entity.lotNumber,
      Number(entity.purchasePrice),
      Number(entity.initialQuantity),
      entity.purchaseUnit,
      entity.receivedDate,
      entity.expirationDate,
      entity.manufacturingDate,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.product ? ProductTypeOrmMapper.toDomain(entity.product) : null,
      entity.lotUnitPurchases ? entity.lotUnitPurchases.map(lotUnitPurchase => LotUnitPurchaseMapper.toDomain(lotUnitPurchase)) : null,
      entity.suplier? SuplierMapper.toDomainEntity(entity.suplier): null,
    );
  }

  static toOrm(domain: LotEntity): LotOrmEntity {
    const orm = new LotOrmEntity();
    orm.lotId = domain.lotId;
    orm.productId = domain.productId;
    orm.suplierId = domain.suplierId;
    orm.lotNumber = domain.lotNumber;
    orm.purchasePrice = domain.purchasePrice.toString();
    orm.initialQuantity = domain.initialQuantity.toString();
    orm.purchaseUnit = domain.purchaseUnit;
    orm.expirationDate = domain.expirationDate;
    orm.manufacturingDate = domain.manufacturingDate;
    orm.receivedDate = domain.receivedDate;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt ?? null;
    orm.deletedAt = domain.deletedAt ?? null;
    orm.product = domain.product ? ProductTypeOrmMapper.toOrm(domain.product) : null;
    orm.lotUnitPurchases = domain.lotUnitPurchases ? domain.lotUnitPurchases?.map(lotUnitPurchase => LotUnitPurchaseMapper.toOrmEntity(lotUnitPurchase)) : null;
    orm.suplier = domain.suplier? SuplierMapper.toOrmEntity(domain.suplier): null;
    return orm;
  }
}