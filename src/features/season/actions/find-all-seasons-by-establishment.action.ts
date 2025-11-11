'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { SeasonRepositoryFactory } from '../infraestructure/factories/season-repository.factory';
import { FindAllSeasonsByEstablishmentUseCase } from '../application/use-case/find-all-seasons-by-establishment.use-case';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function findAllSeasonsBYEstablishmentAction(){
    noStore(); // Evitar que se cachée este server action
    
    const seasonFetchRepositoryImpl = SeasonRepositoryFactory.create();
    const useCase = new FindAllSeasonsByEstablishmentUseCase(seasonFetchRepositoryImpl);

    const cookieStore = await cookies();           
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }
    const result = await useCase.execute(establishmentId);

    return {
        ...result
    }
}