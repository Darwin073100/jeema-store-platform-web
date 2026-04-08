'use server'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { IEmployee } from '@/contexts/employee-management/employee/presentation/interfaces/IEmployee';
import { CloseCashSessionDTO } from '../../application/dtos/close-cash-session.dto';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { CloseCashSessionUseCase } from '../../application/use-cases/close-cash-session.use-case';
import { TypeormTransactionRepository } from '@/contexts/transaction-management/transaction/infraestructure/repositories/typeorm-transaction.repository';
import { Result } from '@/shared/lib/utils/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function closeCashSessionAction(cashSessionId: bigint, dto: Omit<CloseCashSessionDTO, 'branchOfficeId'|'employeeId'>){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashSessionRepository.create();
        const transactionRepo = await TypeormTransactionRepository.create();
        const useCase = new CloseCashSessionUseCase(repository, transactionRepo);
        const cookieStore = await cookies();
                        
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }

        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as IEmployee).employeeId;
        }
        
        const result = await useCase.execute(cashSessionId, {
            ...dto,
            employeeId,
            branchOfficeId
        });

        revalidatePath('/cash');

        return {
            ...Result.success(CashSessionMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'closeCashSessionAction')
        }
    }
}