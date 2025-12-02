'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { TransactionRepositoryFactory } from '../infraestructure/factories/transaction-repository.factory';
import { findAllManyFilterTransactionsUseCase } from '../application/use-cases/find-all-many-filter-transactions.use-case';
import { ManyFilterTransactionsDTO } from '../application/dtos/many-filter-transactions.dto';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function findAllManyFilterTransactionsAction(dto: Omit<ManyFilterTransactionsDTO, 'establishmentId'>){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= TransactionRepositoryFactory.create();
        const useCase = new findAllManyFilterTransactionsUseCase(repository);
        
        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }

        const currentDTO: ManyFilterTransactionsDTO = {
            ...dto,
            establishmentId
        }

        const result = await useCase.execute(currentDTO);

        return {
            ...result
        }
    } catch (error) {
        console.error('findAllManyFilterTransactionsAction:', error);
        throw error;
    }
}