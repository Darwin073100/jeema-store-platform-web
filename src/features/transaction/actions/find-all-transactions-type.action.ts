'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { TransactionRepositoryFactory } from '../infraestructure/factories/transaction-repository.factory';
import { AccountTypeEnum } from '../domain/enums/account-type.enum';
import { FindAllTransactionsTypeUseCase } from '../application/use-cases/find-all-transactions-type.use-case';

export async function findAllTransactionsTypeAction(accountType: AccountTypeEnum){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= TransactionRepositoryFactory.create();
        const useCase = new FindAllTransactionsTypeUseCase(repository);

        const result = await useCase.execute(accountType);

        return {
            ...result
        }
    } catch (error) {
        console.error('findAllTransactionsTypeAction:', error);
        throw error;
    }
}