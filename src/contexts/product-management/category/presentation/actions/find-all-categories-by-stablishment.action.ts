'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { TypeormCategoryRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-category.repository';
import { FindAllCategoriesByEstablishmentUseCase } from '../../application/use-cases/find-all-categories-by-establishment.use-case';
import { CategoryMapper } from '../../application/mappers/category-mapper';

export async function findAllCategoriesByEstablishmentAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormCategoryRepository.create();
        const viewAllCategoriesUseCase = new FindAllCategoriesByEstablishmentUseCase(categoryRepo);
        
        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        const result = await viewAllCategoriesUseCase.execute(establishmentId);

        return result? result.map(item => CategoryMapper.toIResponse(item)): [];
    } catch (error) {
        console.error('findAllCategoriesByEstablishmentAction: ', error);
        return [];
    }
}