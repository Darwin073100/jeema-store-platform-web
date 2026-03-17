'use server'

import { revalidatePath } from "next/cache";
import { UpdateCategoryDTO } from "../application/dtos/update-category.dto";
import { UpdateCategoryUseCase } from "../application/use-case/update-category.use-case";
import { CategoryRepositoryFactory } from "../infraestructure/factories/category-repository.factory";

export async function updateCategoryAction(dto: UpdateCategoryDTO){
    try {
        const categoryRepository = CategoryRepositoryFactory.create();
        const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

        const result = await updateCategoryUseCase.execute(dto);
        
        revalidatePath('/dashboard');
        
        return {
            ...result
        }
    } catch (error) {
        console.error('Error in updateCategoryAction:', error);
        throw error;
    }
}
