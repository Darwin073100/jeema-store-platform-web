import { TemplateRepository } from 'src/shared/domain/repositories/template.repository';
import { ProductEntity } from '../entities/product.entity';
import { PaginationDTO } from '@/shared/application/dtos/pagination.dto';
import { FilterProductListDTO } from '../../application/dtos/filter-product-list.dto';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository extends TemplateRepository<ProductEntity>{
  findByEstablishmentAndSku(establishmentId: bigint, sku: string): Promise<ProductEntity | null>;
  findByEstablishmentAndUniversalBarCode(establishmentId: bigint, barCode: string): Promise<ProductEntity | null>;
  save(product: ProductEntity): Promise<ProductEntity>;
  saveProductWithLotAdnInventoryItem(product: ProductEntity): Promise<ProductEntity>;
  findByIdCategoryBrandSeason(entityId: bigint): Promise<ProductEntity | null>;
  saveCompleteProduct(product: ProductEntity): Promise<ProductEntity>;
  findAllByEstablishment(establishmentId: bigint, dto: PaginationDTO): Promise<ProductEntity[]>;
  findAllByBranchOffice(branchOfficeId: bigint): Promise<ProductEntity[]>;
  existById(productId: bigint):Promise<ProductEntity | null>;
  findAllByEstablishmentAndName(establishmentId: bigint, dto: FilterProductListDTO): Promise<ProductEntity[]>;
}
