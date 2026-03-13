import { FilterTopEnum } from "../../domain/enums/FilterTopEnum";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductsTopByBranchOfficeResponseDto } from "../dtos/products-top-by-branch-office-response.dto";
export class FindTopProductsByBranchOfficeUseCase{
    constructor(
        private readonly productRepository: ProductRepository
    ){}

    async execute(branchOfficeId: bigint, filterBy: FilterTopEnum = FilterTopEnum.QUANTITY_SALES, limit = 10): Promise<ProductsTopByBranchOfficeResponseDto[]>{
        const products = await this.productRepository.findAllByBranchOffice(branchOfficeId);
        const result: ProductsTopByBranchOfficeResponseDto[] = products.map(item => ({
            productId: item.productId,
            name: item.name.value,
            quantitySales: item.saleDetails?.reduce((acc, saleDetail) => acc + Number(saleDetail?.quantity), 0) ?? 0,
            totalSales: item.saleDetails?.reduce((acc, saleDetail) => acc + Number(saleDetail?.subtotalItem), 0) ?? 0
        })).sort((a, b) => b[filterBy] - a[filterBy]).slice(0, limit);
        return result;
    }
}