import { Result } from "@/shared/features/result";
import { CategoryEntity } from "../entities/category.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterCategoryDTO } from "../../application/dtos/register-category.dto";
import { UpdateCategoryDTO } from "../../application/dtos/update-category.dto";

export interface CategoryRepository{
    save(entity: RegisterCategoryDTO): Promise<Result<CategoryEntity, ErrorEntity>>
    update(entity: UpdateCategoryDTO): Promise<Result<CategoryEntity, ErrorEntity>>
    delete(categoryId: string): Promise<Result<boolean, ErrorEntity>>
    findAll(): Promise<Result<{categories: CategoryEntity[]}, ErrorEntity>>
    findAllCategoriesByEstablishment(establishmentId: bigint): Promise<Result<{ categories: CategoryEntity[]; }, ErrorEntity>>
}