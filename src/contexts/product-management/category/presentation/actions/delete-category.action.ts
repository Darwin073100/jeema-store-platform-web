'use server'

import { revalidatePath } from 'next/cache';
import { DeleteCategoryUseCase } from "../application/use-case/delete-category.use-case";
import { CategoryRepositoryFactory } from '../infraestructure/factories/category-repository.factory';

export async function deleteCategoryAction(categoryId: string){
    try {
        const categoryRepository = CategoryRepositoryFactory.create();
        const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

        const result = await deleteCategoryUseCase.execute(categoryId);

        // Invalidar el caché de la página para que se actualicen los datos
        if (result?.ok) {
            revalidatePath('/dashboard');
        }

        return {
            ...result
        }
    } catch (error) {
        console.error('Error in deleteCategoryAction:', error);
        throw error;
    }
}
