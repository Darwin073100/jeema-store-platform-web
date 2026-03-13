import { CategoryEntity } from "../../domain/entities/category-entity";
import { CategoryNotFoundException } from "../../domain/exceptions/category-not-found.exception";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { UpdateCategoryDTO } from "../dtos/update-category.dto";

export class UpdatedCategoryUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) {}

    async execute(command: UpdateCategoryDTO): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findById(command.categoryId);
        if (!category) {
            throw new CategoryNotFoundException('Categoría no encontrada');
        }
        if(command.name != undefined){
            category.updateName(command.name);
        }
        if(command.description !== undefined){
            category.updateDescription(command.description ?? null);
        }

        return this.categoryRepository.save(category);
    }
}