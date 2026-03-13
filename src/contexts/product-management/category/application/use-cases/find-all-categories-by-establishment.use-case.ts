import { CategoryEntity } from "../../domain/entities/category-entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export class FindAllCategoriesByEstablishmentUseCase{
    constructor(
        private readonly repository: CategoryRepository
    ){}

    async execute(establishmentId: bigint):Promise<CategoryEntity[]>{
        const result = await this.repository.findAllByEstablishment(establishmentId);
        return result;
    }
}