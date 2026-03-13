import { BrandNotFoundException } from "../../domain/exceptions/brand-not-found.exception";
import { BrandRepository } from "../../domain/repositories/brand.repository";

export class DeleteBrandUseCase {
    constructor(
        private readonly brandRepository: BrandRepository
    ){}

    async execute(brandId: bigint): Promise<void> {
        const brand = await this.brandRepository.findById(brandId);
        if (!brand) {
            throw new BrandNotFoundException('La marca seleccionada no existe.');
        }

        await this.brandRepository.delete(brandId);
    }
}