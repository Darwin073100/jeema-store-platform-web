'use server'
import { IEmployee } from '@/contexts/employee-management/employee/presentation/interfaces/IEmployee';
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { FindCashSessionByEmployeeIdUseCase } from '../../application/use-cases/find-cash-session-by-employee-id.use-case';
import { Result } from '@/shared/features/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function findCashSessionByEmployeeIdAction(){
    noStore(); // Evitar que se cachée este server action
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= await TypeormCashSessionRepository.create();
        const useCase = new FindCashSessionByEmployeeIdUseCase(repository);
        
        const cookieStore = await cookies();
                
        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as IEmployee).employeeId;
        }
        const result = await useCase.execute(employeeId);

        return {
            ...Result.success(CashSessionMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'findCashSessionByEmployeeIdAction')
        }
    }
}