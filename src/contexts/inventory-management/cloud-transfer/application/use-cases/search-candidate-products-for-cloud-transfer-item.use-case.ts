import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { SearchCandidateProductsForCloudTransferItemDto } from "../dtos/search-candidate-products-for-cloud-transfer-item.dto";

/**
 * Reutiliza el mismo método ILIKE que ya usa la búsqueda de productos existente
 * (`ProductRepository.findAllByEstablishmentAndName`), no se crea lógica de búsqueda nueva. Ver
 * spect/08_cloud_transfer_spect.md sección 5.9.
 */
export class SearchCandidateProductsForCloudTransferItemUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(dto: SearchCandidateProductsForCloudTransferItemDto): Promise<ProductEntity[]> {
        return this.productRepository.findAllByEstablishmentAndName(dto.establishmentId, { product: dto.searchText });
    }
}
