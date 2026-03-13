import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class ViewProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: bigint): Promise<ProductEntity|null> {
    return this.productRepository.findById(id);
  }
}