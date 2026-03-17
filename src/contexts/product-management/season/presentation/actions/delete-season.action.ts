'use server'
import { revalidatePath } from 'next/cache';
import { TypeormSeasonRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { DeleteSeasonUseCase } from '../../application/use-cases/delete-season.use-case';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { Result } from '@/shared/features/result';

export async function deleteSeasonAction(seasonId: bigint) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormSeasonRepository.create();
        const useCase = new DeleteSeasonUseCase(categoryRepo);

        await useCase.execute(seasonId);
        revalidatePath('/products/list');
        return {
            ...Result.success<{}>({})
        };
    } catch (error) {
        console.error('deleteSeasonAction: ', error);
        return {
            ...handleError(error, 'deleteSeasonAction')
        };
    }
}