'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { TypeormCashRegisterRepository } from '../../infraestructure/repositories/typeorm-cash-register.repository';
import { FindAllCashRegisterByBranchOfficeIdUseCase } from '../../application/use-cases/find-all-cash-register-by-branch-office-id.use-case';
import { Result } from '@/shared/lib/utils/result';
import { CashRegisterMapper } from '../../application/mappers/cash-register.mapper';

export async function findAllCashRegisterByBranchOfficeIdAction(){
    noStore(); // Evitar que se cachée este server action
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= await TypeormCashRegisterRepository.create();
        const useCase = new FindAllCashRegisterByBranchOfficeIdUseCase(repository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const result = await useCase.execute(branchOfficeId);

        return {
            ...Result.success({cashRegisters: result.map(item => CashRegisterMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error({accion: 'findAllCashRegisterByBranchOfficeIdAction', error});
        return {
            ...Result.success({cashRegisters: []})
        }
    }
}