'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { EstablishmentEntity } from '../domain/entities/establishment.entity';
import { EstablishmentRepositoryFactory } from '../infraestructure/factories/establishment-repository.ractory';
import { FindEstablishmentByIdUseCase } from '../application/use-case/find-establishment-by-id.use-case';

export async function findEstablishmentByIdAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= EstablishmentRepositoryFactory.create();
        const useCase = new FindEstablishmentByIdUseCase(repository);
        
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
    } catch (error) {
        console.error('findEstablishmentByIdAction: ', error);
        throw error;
    }
}