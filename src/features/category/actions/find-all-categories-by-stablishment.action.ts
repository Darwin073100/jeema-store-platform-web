'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { CategoryRepositoryFactory } from '../infraestructure/factories/category-repository.factory';
import { FindAllCategoriesByEstablishmentUseCase } from '../application/use-case/find-all-categories-by-establishment.use-case';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function FindAllCategoriesByEstablishmentAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepository = CategoryRepositoryFactory.create();
        const viewAllCategoriesUseCase = new FindAllCategoriesByEstablishmentUseCase(categoryRepository);
        
        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        const result = await viewAllCategoriesUseCase.execute(establishmentId);

        return {
            ...result
        }
    } catch (error) {
        console.error('Error in ViewAllCategoriesAction:', error);
        throw error;
    }
}