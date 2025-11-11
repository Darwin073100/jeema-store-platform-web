'use server'
import { revalidatePath } from 'next/cache';
import { RegisterSeasonDTO } from "../application/dtos/register-season.dto";
import { RegisterSeasonUseCase } from "../application/use-case/register-season.use-case";
import { SeasonRepositoryFactory } from '../infraestructure/factories/season-repository.factory';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function registerSeasonAction(dto: Omit<RegisterSeasonDTO, 'establishmentId'>){
    const seasonFetchRepositoryImpl = SeasonRepositoryFactory.create();
    const registerSeasonUseCase = new RegisterSeasonUseCase(seasonFetchRepositoryImpl);

    const cookieStore = await cookies();           
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }
    const currentDTO = {
        ...dto,
        establishmentId
    }

    const result = await registerSeasonUseCase.execute(currentDTO);
    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }
    
    return {
        ...result
    }
}