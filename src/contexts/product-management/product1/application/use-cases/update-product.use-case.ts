/**
 * Caso de Uso: Actualizar Producto
 * Contiene la lógica de negocio para actualizar un producto existente
 */

import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductNameVO } from '../../domain/value-objects/product-name.vo';
import { ProductSkuVO } from '../../domain/value-objects/product-sku.vo';
import { ProductDescriptionVO } from '../../domain/value-objects/product-description.vo';
import { ProductUniversalBarCodeVO } from '../../domain/value-objects/product-universal-bar-code.vo';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';

export class UpdateProductUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(input: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      const repository = await TypeOrmProductRepository.create();

      // Obtener el producto existente
      const existingProduct = await repository.findById(input.productId);
      if (!existingProduct) {
        throw new ProductNotFoundException(input.productId);
      }

      // Actualizar campos si están presentes
      if (input.name) {
        existingProduct.updateName(new ProductNameVO(input.name));
      }

      if (input.sku !== undefined) {
        existingProduct.updateSku(new ProductSkuVO(input.sku || ''));
      }

      if (input.universalBarCode !== undefined) {
        existingProduct.updateUniversalBarCode(
          new ProductUniversalBarCodeVO(input.universalBarCode)
        );
      }

      if (input.description !== undefined) {
        existingProduct.updateDescription(
          new ProductDescriptionVO(input.description)
        );
      }

      if (input.unitOfMeasure) {
        existingProduct.updateUnitOfMeasure(input.unitOfMeasure as ForSaleEnum);
      }

      if (input.minStockGlobal !== undefined) {
        existingProduct.updateMinStockGlobal(input.minStockGlobal);
      }

      if (input.imageUrl !== undefined) {
        existingProduct.updateImageUrl(input.imageUrl);
      }

      // Guardar los cambios
      const updatedProduct = await repository.save(existingProduct);

      // Retornar como DTO
      return ProductMapper.toResponseDto(updatedProduct);
    } catch (error) {
      console.error('Error en UpdateProductUseCase:', error);
      throw error;
    }
  }
}
