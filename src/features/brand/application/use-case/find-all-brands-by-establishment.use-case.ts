import { BrandRepository } from "../../domain/repositories/brand.repository";

export class FindAllBrandsByEstablishmentUseCase{
    constructor(
        private readonly repository: BrandRepository
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllByEstablishment(establishmentId);
        return result;
    }
}