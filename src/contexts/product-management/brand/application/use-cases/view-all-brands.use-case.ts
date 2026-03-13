import { BrandRepository } from "../../domain/repositories/brand.repository";

export class ViewAllBrandsUseCase{
    constructor(
        private readonly repository: BrandRepository,
    ){}

    async execute(){
        const result = await this.repository.findAll();
        return result;
    }
}