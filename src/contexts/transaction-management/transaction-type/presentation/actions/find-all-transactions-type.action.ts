'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { AccountTypeEnum } from '../../domain/enums/account-type.enum';
import { FindAllTransactionsTypeUseCase } from '../../applications/use-cases/find-all-transactions-type.use-case';
import { TypeormTransactionTypeRepository } from '../../infraestructure/repositories/typeorm-transaction-type.repository';
import { Result } from '@/shared/features/result';
import { TransactionTypeMapper } from '../../applications/mappers/transaction-type.mapper';

export async function findAllTransactionsTypeAction(accountType: AccountTypeEnum){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormTransactionTypeRepository.create();
        const useCase = new FindAllTransactionsTypeUseCase(repository);

        const result = await useCase.execute(accountType);

        return {
            ...Result.success({transactionsType: result.map(item => TransactionTypeMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error('findAllTransactionsTypeAction:', error);
        return {
            ...Result.success({transactionsType: []})
        }
    }
}