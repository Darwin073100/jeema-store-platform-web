import { PaginationDTO } from "@/shared/application/dtos/pagination.dto";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class ViewAllProductsByEstablishmentUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(establishmentId: bigint, dto?: PaginationDTO): Promise<ProductEntity[]> {
    return this.productRepository.findAllByEstablishment(establishmentId, dto?? {page: 1, pageSize:100});
  }
}
