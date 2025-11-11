import { CategoryRepository } from "../../domain/repositories/category.repository";

export class FindAllCategoriesByEstablishmentUseCase{
    constructor(
        private readonly repository: CategoryRepository
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllCategoriesByEstablishment(establishmentId);
        return result;
    }
}