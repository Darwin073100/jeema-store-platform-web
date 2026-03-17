'use server'

import { revalidatePath } from "next/cache";
import { UpdateSeasonDTO } from "../application/dtos/update-season.dto";
import { UpdateSeasonUseCase } from "../application/use-case/update-season.use-case";
import { SeasonRepositoryFactory } from "../infraestructure/factories/season-repository.factory";

export async function updateSeasonAction(dto: UpdateSeasonDTO){
    try {
        const seasonRepository = SeasonRepositoryFactory.create();
        const updateSeasonUseCase = new UpdateSeasonUseCase(seasonRepository);

        const result = await updateSeasonUseCase.execute(dto);
        
        revalidatePath('/dashboard');
        
        return {
            ...result
        }
    } catch (error) {
        console.error('Error in updateSeasonAction:', error);
        throw error;
    }
}