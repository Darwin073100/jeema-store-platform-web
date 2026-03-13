/**
 * Caso de Uso: Obtener Productos por Establecimiento
 * Contiene la lógica de negocio para obtener los productos de un establecimiento específico
 */

import { ProductResponseDto } from '../dtos/product-response.dto';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../mappers/product.mapper';

export class GetProductsByEstablishmentUseCase {
  /**
   * Ejecuta el caso de uso
   */
  async execute(establishmentId: bigint): Promise<ProductResponseDto[]> {
    try {
      const repository = await TypeOrmProductRepository.create();
      const products = await repository.findAllByEstablishment(establishmentId);
      return ProductMapper.toResponseList(products);
    } catch (error) {
      console.error('Error en GetProductsByEstablishmentUseCase:', error);
      throw error;
    }
  }
}
