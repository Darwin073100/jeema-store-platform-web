'use server'
import { cookies } from 'next/headers';
import { RegisterCategoryDto } from '../../application/dtos/register-category.dto';
import { TypeormCategoryRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-category.repository';
import { RegisterCategoryUseCase } from '../../application/use-cases/register-category.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { Result } from '@/shared/features/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { CategoryMapper } from '../../application/mappers/category-mapper';

export async function registerCategoryAction(dto: Omit<RegisterCategoryDto, 'establishmentId'>) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormCategoryRepository.create();
        const useCase = new RegisterCategoryUseCase(categoryRepo);

        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute({
            ...dto,
            establishmentId
        });

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