/**
 * Caso de Uso: Obtener Producto por ID
 * Contiene la lógica de negocio para obtener un producto específico
 */

import { ProductResponseDto } from '../dtos/product-response.dto';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

export class GetProductByIdUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(productId: bigint): Promise<ProductResponseDto> {
    try {
      const repository = await TypeOrmProductRepository.create();
      const product = await repository.findById(productId);

      if (!product) {
        throw new ProductNotFoundException(productId);
      }

      return ProductMapper.toResponseDto(product);
    } catch (error) {
      console.error('Error en GetProductByIdUseCase:', error);
      throw error;
    }
  }
}
