import { TemplateRepository } from 'src/shared/domain/repositories/template.repository';
import { ProductEntity } from '../entities/product.entity';
import { PaginationDTO } from '@/shared/application/dtos/pagination.dto';
import { FilterProductListDTO } from '../../application/dtos/filter-product-list.dto';
import { TopSellingProduct, TopSellingProductsCriteria } from '../read-models/top-selling-product.read-model';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository extends TemplateRepository<ProductEntity>{
  findByEstablishmentAndSku(establishmentId: bigint, sku: string): Promise<ProductEntity | null>;
  findByEstablishmentAndUniversalBarCode(establishmentId: bigint, barCode: string): Promise<ProductEntity | null>;
  save(product: ProductEntity): Promise<ProductEntity>;
  saveProductWithLotAdnInventoryItem(product: ProductEntity): Promise<ProductEntity>;
  findByIdCategoryBrandSeason(entityId: bigint): Promise<ProductEntity | null>;
  saveCompleteProduct(product: ProductEntity): Promise<ProductEntity>;
  findAllByEstablishment(establishmentId: bigint, dto: PaginationDTO): Promise<ProductEntity[]>;
  /**
   * Ranking de productos más vendidos en una sucursal (solo ventas COMPLETED), agregado en BD.
   * @param {bigint} branchOfficeId
   * @param {TopSellingProductsCriteria} criteria periodo [dateInit, dateFinish), categoría, orden y límite
   * @returns {Promise<TopSellingProduct[]>}
   */
  findTopSellingByBranchOffice(branchOfficeId: bigint, criteria: TopSellingProductsCriteria): Promise<TopSellingProduct[]>;
  existById(productId: bigint):Promise<ProductEntity | null>;
  findAllByEstablishmentAndName(establishmentId: bigint, dto: FilterProductListDTO): Promise<ProductEntity[]>;
  /**
   * Actualiza únicamente el costo promedio móvil (Product.averageCost) de un producto,
   * sin tocar el resto de sus campos. Usado por RecalculateProductAverageCostUseCase y por
   * los hooks de compra de lote (mantenimiento incremental del promedio).
   * @param {bigint} productId
   * @param {number} averageCost
   * @returns {Promise<ProductEntity>}
   */
  updateAverageCost(productId: bigint, averageCost: number): Promise<ProductEntity>;
}
