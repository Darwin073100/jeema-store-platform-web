'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';import { cookies } from 'next/headers';
import { EstablishmentEntity } from '../domain/entities/establishment.entity';
import { EstablishmentRepositoryFactory } from '../infraestructure/factories/establishment-repository.ractory';
import { UpdateEstablishmentUseCase } from '../application/use-case/update.establishment.use-case';

export async function updateEstablishmentAction(name: string){
    noStore(); // Evitar que se cachée este server action 
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= EstablishmentRepositoryFactory.create();
        const useCase = new UpdateEstablishmentUseCase(repository);

        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        const result = await useCase.execute(establishmentId, name);

        if(result.ok){
            revalidatePath('/configurations/establishment');
        }
        return {
            ...result
        }
    } catch (error) {
        console.error('updateEstablishmentAction: ', error);
        throw error;
    }
}