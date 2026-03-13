/**
 * Mapper para Producto
 * Convierte entre ORM Entity → Domain Entity → Response DTO
 */

import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductOrmEntity } from '../../infraestructure/persistence/typeorm/entities/product.orm-entity';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductNameVO } from '../../domain/value-objects/product-name.vo';
import { ProductSkuVO } from '../../domain/value-objects/product-sku.vo';
import { ProductDescriptionVO } from '../../domain/value-objects/product-description.vo';
import { ProductUniversalBarCodeVO } from '../../domain/value-objects/product-universal-bar-code.vo';

export class ProductMapper {
  /**
   * Convierte ORM Entity a Domain Entity
   */
  static toDomain(ormEntity: ProductOrmEntity): ProductEntity {
    return ProductEntity.reconstitute(
      ormEntity.productId,
      ormEntity.establishmentId,
      ormEntity.categoryId,
      ormEntity.brandId,
      ormEntity.seasonId,
      new ProductNameVO(ormEntity.name),
      new ProductSkuVO(ormEntity.sku || ''),
      new ProductUniversalBarCodeVO(ormEntity.universalBarCode),
      new ProductDescriptionVO(ormEntity.description),
      ormEntity.unitOfMeasure,
      Number(ormEntity.minStockGlobal), // Convertir decimal a number
      ormEntity.imageUrl,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt
    );
  }

  /**
   * Convierte una lista de ORM Entities a Domain Entities
   */
  static toDomainList(ormEntities: ProductOrmEntity[]): ProductEntity[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  /**
   * Convierte Domain Entity a ORM Entity
   */
  static toORM(domainEntity: ProductEntity): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    ormEntity.productId = domainEntity.productId;
    ormEntity.establishmentId = domainEntity.establishmentId;
    ormEntity.categoryId = domainEntity.categoryId;
    ormEntity.brandId = domainEntity.brandId;
    ormEntity.seasonId = domainEntity.seasonId;
    ormEntity.name = domainEntity.name.value;
    ormEntity.sku = domainEntity.sku.value;
    ormEntity.universalBarCode = domainEntity.universalBarCode.value;
    ormEntity.description = domainEntity.description.value;
    ormEntity.unitOfMeasure = domainEntity.unitOfMeasure;
    ormEntity.minStockGlobal = domainEntity.minStockGlobal.toString();
    ormEntity.imageUrl = domainEntity.imageUrl;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    return ormEntity;
  }

  /**
   * Convierte Domain Entity a Response DTO
   */
  static toResponseDto(domainEntity: ProductEntity): ProductResponseDto {
    return {
      productId: domainEntity.productId,
      establishmentId: domainEntity.establishmentId,
      categoryId: domainEntity.categoryId,
      brandId: domainEntity.brandId,
      seasonId: domainEntity.seasonId,
      name: domainEntity.name.value,
      sku: domainEntity.sku.value,
      universalBarCode: domainEntity.universalBarCode.value,
      description: domainEntity.description.value,
      unitOfMeasure: domainEntity.unitOfMeasure,
      minStockGlobal: domainEntity.minStockGlobal,
      imageUrl: domainEntity.imageUrl,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      deletedAt: domainEntity.deletedAt,
    };
  }

  /**
   * Convierte una lista de Domain Entities a DTOs
   */
  static toResponseList(domainEntities: ProductEntity[]): ProductResponseDto[] {
    return domainEntities.map((entity) => this.toResponseDto(entity));
  }
}
