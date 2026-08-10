'use server'
import { revalidatePath } from 'next/cache';
import { TypeormCashRegisterRepository } from '../../infraestructure/repositories/typeorm-cash-register.repository';
import { TypeormCashSessionRepository } from '@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository';
import { UpdateCashRegisterStatusUseCase } from '../../application/use-cases/update-cash-register-status.use-case';
import { Result } from '@/shared/lib/utils/result';
import { CashRegisterMapper } from '../../application/mappers/cash-register.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function activateCashRegisterAction(cashRegisterId: bigint){
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashRegisterRepository.create();
        const cashSessionRepository = await TypeormCashSessionRepository.create();
        const useCase = new UpdateCashRegisterStatusUseCase(repository, cashSessionRepository);

        const result = await useCase.execute({
            cashRegisterId,
            isActive: true
        });
        revalidatePath('/cash');
        return {
            ...Result.success(CashRegisterMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('activateCashRegisterAction: ', error);
        return {
            ...handleError(error, 'activateCashRegisterAction')
        }
    }
}
