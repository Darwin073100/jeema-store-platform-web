'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { FindCashSessionAllByBranchOfficeUseCase } from '../../application/use-cases/find-cash-session-all-by-branch-office-id.use-case';
import { FindCashMovementsByBranchOfficeDTO } from '../../application/dtos/find-cash-movements-by-branch-office.dto';
import { Result } from '@/shared/features/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';

export async function findCashMovementsByBranchOfficeIdAction(dto: FindCashMovementsByBranchOfficeDTO){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= await TypeormCashSessionRepository.create();
        const useCase = new FindCashSessionAllByBranchOfficeUseCase(repository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const result = await useCase.execute(branchOfficeId, dto);

        return {
            ...Result.success({cashSessions: result.map(item => CashSessionMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error({action: 'findCashMovementsByBranchOfficeIdAction', error});
        return {
            ...Result.success({cashSessions: []})
        }
    }
}