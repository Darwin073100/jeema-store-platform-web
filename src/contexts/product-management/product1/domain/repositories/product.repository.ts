/**
 * Symbol para inyección de dependencias del repositorio de Producto
 */
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

import { TemplateRepository } from '@/shared/domain/repositories/template.repository';
import { ProductEntity } from '../entities/product.entity';

/**
 * Interfaz del Puerto (Domain Repository)
 * Define el contrato que debe cumplir cualquier implementación de persistencia
 */
export interface ProductRepository extends TemplateRepository<ProductEntity> {
  /**
   * Encuentra un producto por establecimiento y SKU
   */
  findByEstablishmentAndSku(establishmentId: bigint, sku: string): Promise<ProductEntity | null>;

  /**
   * Encuentra un producto por establecimiento y código de barras
   */
  findByEstablishmentAndUniversalBarCode(
    establishmentId: bigint,
    barCode: string
  ): Promise<ProductEntity | null>;

  /**
   * Guarda un producto con sus lotes e inventario
   * (operación transaccional compleja)
   */
  saveProductWithLotAndInventoryItem(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Encuentra un producto con todas sus relaciones (categoría, marca, temporada)
   */
  findByIdWithRelations(entityId: bigint): Promise<ProductEntity | null>;

  /**
   * Guarda un producto completo con todas sus relaciones
   */
  saveCompleteProduct(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Obtiene todos los productos por establecimiento
   */
  findAllByEstablishment(establishmentId: bigint): Promise<ProductEntity[]>;

  /**
   * Obtiene todos los productos por sucursal
   */
  findAllByBranchOffice(branchOfficeId: bigint): Promise<ProductEntity[]>;
}
