import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { FilterProductListDTO } from "../dtos/filter-product-list.dto";

export class ViewAllProductsByEstablishmentFilterUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(establishmentId: bigint, dto: FilterProductListDTO): Promise<ProductEntity[]> {
    return this.productRepository.findAllByEstablishmentAndName(establishmentId, dto);
  }
}
