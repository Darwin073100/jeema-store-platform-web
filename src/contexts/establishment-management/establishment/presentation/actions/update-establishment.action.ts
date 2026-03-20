'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';import { cookies } from 'next/headers';
import { TypeOrmEstablishmentRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository';
import { UpdateEstablishmentUseCase } from '../../application/use-cases/update-establishment.use-case';
import { IEstablishment } from '../interfaces/IEstablishment';
import { Result } from '@/shared/features/result';
import { EstablishmentMapper } from '../../application/mappers/establishment.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function updateEstablishmentAction(name: string){
    noStore(); // Evitar que se cachée este server action 
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeOrmEstablishmentRepository.create();
        const useCase = new UpdateEstablishmentUseCase(repository);

        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }

        const result = await useCase.execute({establishmentId, name});

        revalidatePath('/configurations/establishment');

        return {
            ...Result.success(EstablishmentMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('updateEstablishmentAction: ', error);
        return {
            ...handleError(error, 'updateEstablishmentAction')
        }
    }
}