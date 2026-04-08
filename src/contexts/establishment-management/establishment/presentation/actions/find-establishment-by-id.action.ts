'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { TypeOrmEstablishmentRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository';
import { FindEstablishmentByIdUseCase } from '../../application/use-cases/find-establishment-by-id.use-case';
import { IEstablishment } from '../interfaces/IEstablishment';
import { Result } from '@/shared/lib/utils/result';
import { EstablishmentMapper } from '../../application/mappers/establishment.mapper';
import { EstablishmentNotFoundException } from '../../domain/exceptions/establishment-not-found.exception';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function findEstablishmentByIdAction(){
    noStore(); // Evitar que se cachée este server action
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeOrmEstablishmentRepository.create();
        const useCase = new FindEstablishmentByIdUseCase(repository);
        
        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute(establishmentId);

        if(!result){
            throw new EstablishmentNotFoundException('Establecimiento no encontrado.');
        }

        return {
            ...Result.success(EstablishmentMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('findEstablishmentByIdAction: ', error);
        return {
            ...handleError(error, 'findEstablishmentByIdAction')
        }
    }
}