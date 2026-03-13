/**
 * Caso de Uso: Crear Producto
 * Contiene la lógica de negocio para crear un nuevo producto
 */

import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductNameVO } from '../../domain/value-objects/product-name.vo';
import { ProductSkuVO } from '../../domain/value-objects/product-sku.vo';
import { ProductDescriptionVO } from '../../domain/value-objects/product-description.vo';
import { ProductUniversalBarCodeVO } from '../../domain/value-objects/product-universal-bar-code.vo';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../mappers/product.mapper';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { Result } from '@/shared/features/result';
import { ErrorEntity } from '@/shared/features/error.entity';

export class CreateProductUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(input: CreateProductDto): Promise<Result<ProductResponseDto, ErrorEntity>> {
    try {
      // Validar que el SKU no exista si está presente
      if (input.sku) {
        const repository = await TypeOrmProductRepository.create();
        const existingProduct = await repository.findByEstablishmentAndSku(
          input.establishmentId,
          input.sku
        );
        if (existingProduct) {
          throw new Error(
            `Ya existe un producto con SKU "${input.sku}" en este establecimiento`
          );
        }
      }

      // Validar que el código de barras no exista si está presente
      if (input.universalBarCode) {
        const repository = await TypeOrmProductRepository.create();
        const existingProduct = await repository.findByEstablishmentAndUniversalBarCode(
          input.establishmentId,
          input.universalBarCode
        );
        if (existingProduct) {
          throw new Error(
            `Ya existe un producto con código de barras "${input.universalBarCode}"`
          );
        }
      }

      // Crear la entidad de dominio con validaciones
      const productEntity = ProductEntity.create(
        BigInt(0), // ID será generado por la BD
        input.establishmentId,
        input.categoryId,
        input.brandId ?? null,
        input.seasonId ?? null,
        new ProductNameVO(input.name),
        new ProductSkuVO(input.sku || ''),
        new ProductUniversalBarCodeVO(input.universalBarCode ?? null),
        new ProductDescriptionVO(input.description ?? null),
        input.unitOfMeasure as ForSaleEnum,
        input.minStockGlobal,
        input.imageUrl ?? null
      );

      // Guardar en la base de datos
      const repository = await TypeOrmProductRepository.create();
      const savedProduct = await repository.save(productEntity);

      // Retornar como DTO
      return Result.success(ProductMapper.toResponseDto(savedProduct));
    } catch (error: any) {
      return Result.failure<ErrorEntity>({
        error: error.message,
        message: error.message,
        path: '',
        statusCode: 500,
        timestamp: ''
      });
    }
  }
}
