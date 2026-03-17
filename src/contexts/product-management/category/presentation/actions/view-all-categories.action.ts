'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { ViewAllCategoriesUseCase } from "../application/use-case/view-all-categories.use-case";
import { CategoryRepositoryFactory } from '../infraestructure/factories/category-repository.factory';

export async function ViewAllCategoriesAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepository = CategoryRepositoryFactory.create();
        const viewAllCategoriesUseCase = new ViewAllCategoriesUseCase(categoryRepository);

        const result = await viewAllCategoriesUseCase.execute();

        return {
            ...result
        }
    } catch (error) {
        console.error('Error in ViewAllCategoriesAction:', error);
        throw error;
    }
}