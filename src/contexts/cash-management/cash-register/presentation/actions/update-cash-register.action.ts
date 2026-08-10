'use server'
import { revalidatePath } from 'next/cache';
import { TypeormCashRegisterRepository } from '../../infraestructure/repositories/typeorm-cash-register.repository';
import { UpdateCashRegisterUseCase } from '../../application/use-cases/update-cash-register.use-case';
import { Result } from '@/shared/lib/utils/result';
import { CashRegisterMapper } from '../../application/mappers/cash-register.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function updateCashRegisterAction(cashRegisterId: bigint, name: string){
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashRegisterRepository.create();
        const useCase = new UpdateCashRegisterUseCase(repository);

        const result = await useCase.execute({
            cashRegisterId,
            name
        });
        revalidatePath('/cash');
        return {
            ...Result.success(CashRegisterMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('updateCashRegisterAction: ', error);
        return {
            ...handleError(error, 'updateCashRegisterAction')
        }
    }
}
