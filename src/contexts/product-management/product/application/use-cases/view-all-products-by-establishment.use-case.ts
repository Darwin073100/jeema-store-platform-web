import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class ViewAllProductsByEstablishmentUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(establishmentId: bigint): Promise<ProductEntity[]> {
    return this.productRepository.findAllByEstablishment(establishmentId);
  }
}
