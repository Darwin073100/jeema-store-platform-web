'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { FindCashSessionWithTransactionsUseCase } from '../../application/use-cases/find-cash-session-with-transactions.use-case';
import { Result } from '@/shared/features/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function findCashSessionWithTransactionsAction(cashSessionId: bigint) {
    noStore(); // Evitar que se cachée este server action
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashSessionRepository.create();
        const useCase = new FindCashSessionWithTransactionsUseCase(repository);

        const result = await useCase.execute(cashSessionId);

        return {
            ...Result.success(CashSessionMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error,'findCashSessionWithTransactionsAction')
        }
    }
}