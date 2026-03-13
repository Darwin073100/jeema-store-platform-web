/**
 * Caso de Uso: Obtener Todos los Productos
 * Contiene la lógica de negocio para obtener el listado completo de productos
 */

import { ProductResponseDto } from '../dtos/product-response.dto';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../mappers/product.mapper';

export class GetAllProductsUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(): Promise<ProductResponseDto[]> {
    try {
      const repository = await TypeOrmProductRepository.create();
      const products = await repository.findAll();
      return ProductMapper.toResponseList(products);
    } catch (error) {
      console.error('Error en GetAllProductsUseCase:', error);
      throw error;
    }
  }
}
