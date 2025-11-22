'use server'
import { CashFetchRepositoryFactory } from '../infraestructure/factories/cash-fetch-repository.factory';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { cookies } from 'next/headers';
import { OpenCashSessionUseCase } from '../application/use-cases/open-cash-session.use-case';
import { OpenCashSessionDTO } from '../application/dtos/open-cash-session.dto';
import { EmployeeEntity } from '@/features/employee/domain/entities/employee.entity';
import { revalidatePath } from 'next/cache';

export async function openCashSessionAction(dto: Omit<OpenCashSessionDTO, 'branchOfficeId' | 'employeeId'>){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new OpenCashSessionUseCase(repository);
        
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
        
        const currentDto: OpenCashSessionDTO = {
            ...dto,
            branchOfficeId,
            employeeId,
        }

        const result = await useCase.execute(currentDto);

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