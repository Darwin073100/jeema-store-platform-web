import { ProductRepository } from "../../domain/repositories/product.repository";

export class DeleteProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(productId: bigint) {
        const result = await this.productRepository.delete(productId);
        return result;
    }
}