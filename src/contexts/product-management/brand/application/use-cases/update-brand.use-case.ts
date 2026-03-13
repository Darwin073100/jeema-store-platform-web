import { BrandEntity } from "../../domain/entities/brand.entity";
import { BrandNotFoundException } from "../../domain/exceptions/brand-not-found.exception";
import { BrandRepository } from "../../domain/repositories/brand.repository";
import { UpdateBrandDto } from "../dtos/update-brand.dto";

export class UpdateBrandUseCase{
    constructor(
        private readonly brandRepository: BrandRepository
    ){}

    async execute(dto: UpdateBrandDto): Promise<BrandEntity> {
        const brand = await this.brandRepository.findById(dto.brandId);
        if (!brand) {
            throw new BrandNotFoundException('La marca seleccionada no existe.');
        }

        brand.updateName(dto.name);
        return this.brandRepository.save(brand);
    }
}