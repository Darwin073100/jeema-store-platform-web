import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";
import { ProductTypeOrmMapper } from "src/contexts/product-management/product/infraestructure/persistence/typeorm/mappers/product.mapper";
import { SaleDetailOrmEntity } from "../entities/sale-detail.orm-entity";
import { SaleDetailEntity } from "src/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity";
import { InventoryMapper } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/mapper/inventory.mapper";
import { ReturnsMapper } from "src/contexts/sale-management/returns/infraestructure/mappers/returns.mapper";

export class SaleDetailMapper {
  public static toOrmEntity(domainEntity: SaleDetailEntity): SaleDetailOrmEntity {
    const ormEntity = new SaleDetailOrmEntity();
    ormEntity.saleDetailId = domainEntity.saleDetailId;
    ormEntity.saleId = domainEntity.saleId;
    ormEntity.productId = domainEntity.productId;
    ormEntity.inventoryId = domainEntity.inventoryItemId;
    ormEntity.productNameAtSale = domainEntity.productNameAtSale;
    ormEntity.productDescriptionAtSale = domainEntity.productDescriptionAtSale;
    ormEntity.productBarCodeAtSale = domainEntity.productBarCodeAtSale;
    ormEntity.productBrandAtSale = domainEntity.productBrandAtSale;
    ormEntity.productCategoryAtSale = domainEntity.productCategoryAtSale;
    ormEntity.productUnitAtSale = domainEntity.productUnitAtSale;
    ormEntity.quantity = domainEntity.quantity;
    ormEntity.unitPriceAtSale = domainEntity.unitPriceAtSale;
    ormEntity.regularPriceAtSale = domainEntity.regularPriceAtSale;
    ormEntity.discountItem = domainEntity.discountItem;
    ormEntity.saleFor = domainEntity.saleFor;
    ormEntity.subtotalItem = domainEntity.subtotalItem;
    ormEntity.notes = domainEntity.notes;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    ormEntity.sale = domainEntity.sale ? SaleMapper.toTypeOrmEntity(domainEntity.sale) : null;
    ormEntity.product = domainEntity.product ? ProductTypeOrmMapper.toOrm(domainEntity.product) : null;
    ormEntity.inventory = domainEntity.inventory ? InventoryMapper.toOrmEntity(domainEntity.inventory) : null;
    ormEntity.returns = domainEntity.returns? domainEntity.returns.map(item => ReturnsMapper.toOrm(item)): null;
    return ormEntity;
  }

  public static toDomainEntity(ormEntity: SaleDetailOrmEntity): SaleDetailEntity {
    return SaleDetailEntity.reconstitute(
      ormEntity.saleDetailId,
      ormEntity.saleId,
      ormEntity.productId,
      ormEntity.inventoryId,
      ormEntity.productNameAtSale,
      ormEntity.productBarCodeAtSale,
      ormEntity.productUnitAtSale,
      ormEntity.quantity,
      ormEntity.unitPriceAtSale,
      ormEntity.regularPriceAtSale,
      ormEntity.subtotalItem,
      ormEntity.discountItem,
      ormEntity.saleFor,
      ormEntity.productDescriptionAtSale,
      ormEntity.productBrandAtSale,
      ormEntity.productCategoryAtSale,
      ormEntity.notes,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
      ormEntity.sale ? SaleMapper.toDomainEntity(ormEntity.sale) : null,
      ormEntity.product ? ProductTypeOrmMapper.toDomain(ormEntity.product) : null,
      ormEntity.inventory ? InventoryMapper.toDomain(ormEntity.inventory) : null,
      ormEntity.returns ? ormEntity.returns.map(item => ReturnsMapper.toDomain(item)) : null,
    );
  }
}
