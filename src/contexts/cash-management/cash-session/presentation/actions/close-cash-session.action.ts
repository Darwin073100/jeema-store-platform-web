'use server'
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { revalidatePath } from 'next/cache';
import { CloseCashSessionDTO } from '../../../../../features/cash/application/dtos/close-cash-session.dto';
import { CloseCashSessionUseCase } from '../../../../../features/cash/application/use-cases/close-cash-session.use-case';
import { cookies } from 'next/headers';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { IEmployee } from '@/contexts/employee-management/employee/presentation/interfaces/IEmployee';

export async function closeCashSessionAction(cashSessionId: bigint, dto: Omit<CloseCashSessionDTO, 'branchOfficeId'|'employeeId'>){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new CloseCashSessionUseCase(repository);
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

        if(result.ok){
            revalidatePath('/cash');
        }

        return {
            ...result
        }
    } catch (error) {
        throw error;
    }
}