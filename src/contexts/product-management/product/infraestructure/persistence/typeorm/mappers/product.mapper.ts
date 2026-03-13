import { v4 as uuid} from 'uuid';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { ProductNameVO } from '../../../../domain/value-objects/product-name.vo';
import { ProductDescriptionVO } from '../../../../domain/value-objects/product-description.vo';
import { ProductSkuVO } from '../../../../domain/value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '../../../../domain/value-objects/product-universal-bar-code.vo';
import { ForSaleEnum } from '../../../../../../../shared/domain/enums/for-sale.enum';
import { EstablishmentMapper } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/mappers/establishment.mapper';
import { CategoryMapper } from 'src/contexts/product-management/category/infraestructure/persistence/typeorm/mappers/category.mapper';
import { BrandMapper } from 'src/contexts/product-management/brand/infraestruture/persistence/typeorm/mappers/brand.mapper';
import { SeasonMapper } from 'src/contexts/product-management/season/infraestructure/persistence/typeorm/mappers/season.mapper';
import { LotMapper } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/mappers/lot.mapper';
import { InventoryMapper } from 'src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/mapper/inventory.mapper';
import { SaleDetailMapper } from 'src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/mappers/sale-detail.mapper';
// Importar los mappers de las entidades relacionadas
export class ProductTypeOrmMapper {
  static toDomain(entity: ProductOrmEntity): ProductEntity {
    const lots = entity.lots ? entity.lots.map(lot => LotMapper.toDomain(lot)) : null;
    // ...removed console.log...
    return ProductEntity.reconstitute(
      entity.productId,
      entity.establishmentId,
      entity.categoryId,
      entity.brandId ? entity.brandId : null,
      entity.seasonId ? entity.seasonId : null,
      new ProductNameVO(entity.name),
      new ProductSkuVO(entity.sku ?? uuid()),
      new ProductUniversalBarCodeVO(entity.universalBarCode),
      new ProductDescriptionVO(entity.description),
      entity.unitOfMeasure as ForSaleEnum,
      Number(entity.minStockGlobal),
      entity.imageUrl,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.establishment ? EstablishmentMapper.toDomainEntity(entity.establishment) : null,
      entity.category ? CategoryMapper.toDomainEntity(entity.category) : null,
      entity.brand ? BrandMapper.toDomainEntity(entity.brand) : null,
      entity.season ? SeasonMapper.toDomainEntity(entity.season) : null,
      lots,
      entity.inventory ? InventoryMapper.toDomain(entity.inventory): null,
      entity.saleDetails ? entity.saleDetails.map(saleDetail => SaleDetailMapper.toDomainEntity(saleDetail)): null,
    );
  }

  static toOrm(entity: ProductEntity): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.productId = entity.productId;
    orm.establishmentId = entity.establishmentId;
    orm.categoryId = entity.categoryId;
    orm.brandId = entity.brandId ? entity.brandId : null;
    orm.seasonId = entity.seasonId ? entity.seasonId : null;
    orm.name = entity.name.value;
    orm.sku = entity.sku.value;
    orm.universalBarCode = entity.universalBarCode.value;
    orm.description = entity.description.value;
    orm.unitOfMeasure = entity.unitOfMeasure;
    orm.minStockGlobal = entity.minStockGlobal.toString();
    orm.imageUrl = entity.imageUrl;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt;
    // Relaciones inversas (opcional, si necesitas persistirlas)
    orm.establishment = entity.establishment ? EstablishmentMapper.toOrmEntity(entity.establishment) : undefined;
    orm.category = entity.category ? CategoryMapper.toTypeOrmEntity(entity.category) : undefined;
    orm.brand = entity.brand ? BrandMapper.toOrmEntity(entity.brand) : undefined;
    orm.season = entity.season ? SeasonMapper.toOrmEntity(entity.season) : undefined;
    orm.lots = entity.lots ? entity.lots.map(lot => LotMapper.toOrm(lot)) : undefined;
    orm.inventory = entity.inventory ? InventoryMapper.toOrmEntity(entity.inventory): undefined;
    orm.saleDetails = entity.saleDetails ? entity.saleDetails.map(saleDetail => SaleDetailMapper.toOrmEntity(saleDetail)): undefined;
    return orm;
  }
}
