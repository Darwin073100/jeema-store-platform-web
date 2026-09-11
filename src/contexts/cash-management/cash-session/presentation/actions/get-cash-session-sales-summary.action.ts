'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { GetCashSessionSalesSummaryUseCase } from '../../application/use-cases/get-cash-session-sales-summary.use-case';
import { ICashSessionSalesSummary } from '../interfaces/ICashSessionSalesSummary';

export async function getCashSessionSalesSummaryAction(cashSessionId: bigint): Promise<ICashSessionSalesSummary | null> {
    try {
        noStore();

        const cashSessionRepository = await TypeormCashSessionRepository.create();
        const useCase = new GetCashSessionSalesSummaryUseCase(cashSessionRepository);

        return await useCase.execute(cashSessionId);
    } catch (error) {
        console.log(error);
        return null;
    }
}
