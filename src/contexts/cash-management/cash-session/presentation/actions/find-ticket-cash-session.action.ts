'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { FindTicketCashSessionUseCase } from '../../application/use-cases/find-ticket-cash-session.use-case';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { Result } from '@/shared/lib/utils/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function findTicketCashSessionAction(cashSessionId: bigint){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashSessionRepository.create();
        const useCase = new FindTicketCashSessionUseCase(repository);
        
        const result = await useCase.execute(cashSessionId);
    
        return {
            ...Result.success(CashSessionMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'findTicketCashSessionAction')
        }
    }
}