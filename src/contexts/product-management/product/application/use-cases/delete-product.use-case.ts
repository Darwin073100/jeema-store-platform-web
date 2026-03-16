import { ProductRepository } from "../../domain/repositories/product.repository";
import { IProduct } from "../../presentation/interfaces/IProduct";
import { ProductMapper } from "../mappers/product.mapper";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: bigint): Promise<IProduct|null> {
    const result = await this.productRepository.delete(id);
    return result? ProductMapper.toIResponse(result): null
  }
}