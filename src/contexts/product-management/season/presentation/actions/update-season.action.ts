'use server'
import { revalidatePath } from "next/cache";
import { UpdateSeasonDto } from "../../application/dtos/update-season.dto";
import { TypeormSeasonRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-season.repository";
import { UpdateSeasonUseCase } from "../../application/use-cases/update-season.use-case";
import { Result } from "@/shared/features/result";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { SeasonMapper } from "../../application/mappers/season-mapper";

export async function updateSeasonAction(dto: UpdateSeasonDto){
    try {
            // Inyeccion de las dependencias usando Factory
            const categoryRepo = await TypeormSeasonRepository.create();
            const useCase = new UpdateSeasonUseCase(categoryRepo);
    
            const result = await useCase.execute(dto);
    
            revalidatePath('/products/list');
    
            return {
                ...Result.success(SeasonMapper.toIResponse(result))
            };
        } catch (error) {
            console.error('updateSeasonAction: ', error);
            return {
                ...handleError(error, 'updateSeasonAction')
            };
        }
}