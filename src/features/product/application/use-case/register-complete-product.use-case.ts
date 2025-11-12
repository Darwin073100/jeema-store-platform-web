import { ProductRepository } from "../../domain/repositories/product.repository";
import { RegisterCompleteProductDTO } from "../dtos/register-complete-product.dto";

export class RegisterCompleteProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(dto: RegisterCompleteProductDTO) {
        const result = await this.productRepository.registerCompleteProduct(dto);
        return result;
    }
}