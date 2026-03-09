'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { CashFetchRepositoryFactory } from '../infraestructure/factories/cash-fetch-repository.factory';
import { FindTicketCashSessionUseCase } from '../application/use-cases/find-ticket-cash-session.use-case';

export async function findTicketCashSessionAction(cashSessionId: bigint){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new FindTicketCashSessionUseCase(repository);
        
        const result = await useCase.execute(cashSessionId);
    
        return {
            ...result
        }
    } catch (error) {
        throw error;
    }
}