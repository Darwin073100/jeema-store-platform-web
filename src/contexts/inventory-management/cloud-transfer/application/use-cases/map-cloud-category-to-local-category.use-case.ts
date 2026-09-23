import { CategoryRepository } from "src/contexts/product-management/category/domain/repositories/category.repository";
import { CategoryEntity } from "src/contexts/product-management/category/domain/entities/category-entity";
import { CategoryNotFoundException } from "src/contexts/product-management/category/domain/exceptions/category-not-found.exception";
import { MapCloudCategoryToLocalCategoryDto } from "../dtos/map-cloud-category-to-local-category.dto";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";

/**
 * Si viene `localCategoryId`, valida que exista y pertenezca al establishment (mapeo a categoría
 * existente). Si viene `newCategoryName`, crea una `CategoryEntity` nueva. Devuelve la `CategoryEntity`
 * resuelta; la UI la usa como input inmediato de `ResolveCloudTransferItemAsNewProductUseCase`. Ver
 * spect/08_cloud_transfer_spect.md sección 5.9.
 */
export class MapCloudCategoryToLocalCategoryUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async execute(dto: MapCloudCategoryToLocalCategoryDto): Promise<CategoryEntity> {
        if (dto.localCategoryId) {
            const category = await this.categoryRepository.existById(dto.localCategoryId);
            if (!category) {
                throw new CategoryNotFoundException(`La categoría local (${dto.localCategoryId}) no existe.`);
            }
            if (category.establishmentId !== dto.establishmentId) {
                throw new InvalidCloudTransferException('La categoría local no pertenece a este establecimiento.');
            }
            return category;
        }

        if (dto.newCategoryName) {
            const newCategory = CategoryEntity.create(dto.establishmentId, dto.newCategoryName, dto.newCategoryDescription ?? null);
            return this.categoryRepository.save(newCategory);
        }

        throw new InvalidCloudTransferException('Debe indicar localCategoryId o newCategoryName.');
    }
}
