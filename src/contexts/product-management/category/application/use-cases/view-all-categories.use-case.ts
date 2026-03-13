import { CategoryEntity } from "../../domain/entities/category-entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export class ViewAllCategoriesUseCase{
    constructor(
        private readonly repository: CategoryRepository
    ){}

    async execute():Promise<CategoryEntity[]>{
        const result = await this.repository.findAll();
        return result;
    }
}