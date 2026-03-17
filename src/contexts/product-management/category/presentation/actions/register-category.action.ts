'use server'
import { revalidatePath } from 'next/cache';
import { RegisterCategoryDTO } from "../application/dtos/register-category.dto";
import { RegisterCategoryUseCase } from "../application/use-case/register-category.use-case";
import { CategoryRepositoryFactory } from '../infraestructure/factories/category-repository.factory';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function registerCategoryAction(dto: Omit<RegisterCategoryDTO, 'establishmentId'>){
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepository = CategoryRepositoryFactory.create();
        const registerCategoryUseCase = new RegisterCategoryUseCase(categoryRepository);
        const cookieStore = await cookies();
                        
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }

        const currentDTO = {
            ...dto,
            establishmentId: establishmentId.toString()
        }
        const result = await registerCategoryUseCase.execute(currentDTO);

        // Invalidar el caché de la página de productos para que se actualicen los datos
        if (result?.ok) {
            revalidatePath('/dashboard');
        }

        return {
            ...result
        }
    } catch (error) {
        console.error('Error in registerCategoryAction:', error);
        throw error;
    }
}