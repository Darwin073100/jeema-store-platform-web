import { BrandRepository } from "../../domain/repositories/brand.repository";

export class FindAllBrandByEstablishmentUseCase{
    constructor(
        private readonly repository: BrandRepository,
    ){}

    async execute(establishemntId: bigint){
        const result = await this.repository.findAllByEstablishment(establishemntId);
        return result;
    }
}