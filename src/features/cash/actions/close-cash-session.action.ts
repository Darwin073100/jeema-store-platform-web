'use server'
import { CashFetchRepositoryFactory } from '../infraestructure/factories/cash-fetch-repository.factory';
import { revalidatePath } from 'next/cache';
import { CloseCashSessionDTO } from '../application/dtos/close-cash-session.dto';
import { CloseCashSessionUseCase } from '../application/use-cases/close-cash-session.use-case';
import { cookies } from 'next/headers';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { EmployeeEntity } from '@/features/employee/domain/entities/employee.entity';

export async function closeCashSessionAction(cashSessionId: bigint, dto: Omit<CloseCashSessionDTO, 'branchOfficeId'|'employeeId'>){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new CloseCashSessionUseCase(repository);
        const cookieStore = await cookies();
                        
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
        }

        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as EmployeeEntity).employeeId;
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