'use server'
import { TypeormCategoryRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-category.repository';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { Result } from '@/shared/lib/utils/result';

export async function deleteCategoryAction(categoryId: bigint) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormCategoryRepository.create();
        const useCase = new DeleteCategoryUseCase(categoryRepo);

        const result = await useCase.execute(categoryId);

        return {
            ...Result.success(result)
        }
    } catch (error) {
        console.error('deleteCategoryAction: ', error);
        return handleError(error, 'deleteCategoryAction');
    }
}
