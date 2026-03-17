'use server'
import { revalidatePath } from 'next/cache';
import { DeleteSeasonUseCase } from "../application/use-case/delete-season.use-case";
import { SeasonRepositoryFactory } from '../infraestructure/factories/season-repository.factory';

export async function deleteSeasonAction(seasonId: bigint){
    const seasonFetchRepositoryImpl = SeasonRepositoryFactory.create();
    const deleteSeasonUseCase = new DeleteSeasonUseCase(seasonFetchRepositoryImpl);

    const result = await deleteSeasonUseCase.execute(seasonId);

    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }

    return {
        ...result
    }
}