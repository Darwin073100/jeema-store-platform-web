import { CategoryNotFoundException } from "../../domain/exceptions/category-not-found.exception";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export class DeleteCategoryUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) {}

    async execute(categoryId: bigint): Promise<void> {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new CategoryNotFoundException('Categoría no encontrada');
        }
        await this.categoryRepository.delete(categoryId);
    }
}