'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { FindCashSessionWithTransactionsUseCase } from '../../../../../features/cash/application/use-cases/find-cash-session-with-transactions.use-case';

export async function findCashSessionWithTransactionsAction(cashSessionId: bigint){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new FindCashSessionWithTransactionsUseCase(repository);
        
        const result = await useCase.execute(cashSessionId);
    
        return {
            ...result
        }
    } catch (error) {
        throw error;
    }
}