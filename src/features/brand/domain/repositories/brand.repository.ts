import { ErrorEntity } from "@/shared/features/error.entity"
import { Result } from "@/shared/features/result"
import { BrandEntity } from "../entities/brand.entity"
import { RegisterBrandDTO } from "../../application/dtos/register-brand.dto"
import { UpdateBrandDTO } from "../../application/dtos/update-brand.dto"

export interface BrandRepository{
    save(dto: RegisterBrandDTO): Promise<Result<BrandEntity, ErrorEntity>>;
    update(dto: UpdateBrandDTO): Promise<Result<BrandEntity, ErrorEntity>>;
    delete(brandId: string): Promise<Result<boolean, ErrorEntity>>;
    findAll(): Promise<Result<{brands: BrandEntity[]}, ErrorEntity>>;
    findAllByEstablishment(establishmentId: bigint): Promise<Result<{ brands: BrandEntity[]; }, ErrorEntity>>;
}