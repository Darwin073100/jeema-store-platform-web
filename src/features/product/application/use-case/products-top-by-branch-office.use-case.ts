import { ProductRepository } from "../../domain/repositories/product.repository";
import { FilterTopRequestDTO } from "../dtos/filter-top.dto";

export class FindTopProductsByBranchOfficeUseCase {
    constructor(
        private readonly productRepository: ProductRepository
    ){}

    async execute(branchOfficeId: bigint, filter: FilterTopRequestDTO) {
        const result = await this.productRepository.findTopProductsByBranchOffice(branchOfficeId, filter);
        return result;
    }
}