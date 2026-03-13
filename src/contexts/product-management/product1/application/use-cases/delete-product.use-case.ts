/**
 * Caso de Uso: Eliminar Producto
 * Contiene la lógica de negocio para eliminar un producto (soft delete)
 */

import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

export class DeleteProductUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(productId: bigint): Promise<boolean> {
    try {
      const repository = await TypeOrmProductRepository.create();
      const product = await repository.findById(productId);

      if (!product) {
        throw new ProductNotFoundException(productId);
      }

      const deleted = await repository.delete(productId);
      return deleted !== null;
    } catch (error) {
      console.error('Error en DeleteProductUseCase:', error);
      throw error;
    }
  }
}
