'use server'
import { Result } from "@/shared/lib/utils/result";
import { UpdateCategoryDTO } from "../../application/dtos/update-category.dto";
import { UpdatedCategoryUseCase } from "../../application/use-cases/updated-category.use-case";
import { TypeormCategoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-category.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { CategoryMapper } from "../../application/mappers/category-mapper";

export async function updateCategoryAction(dto: UpdateCategoryDTO) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormCategoryRepository.create();
        const useCase = new UpdatedCategoryUseCase(categoryRepo);

        const result = await useCase.execute(dto);

        return {
            ...Result.success(CategoryMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerCategoryAction: ', error);
        return {
            ...handleError(error, 'registerCategoryAction')
        }
    }
}
