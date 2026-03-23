'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { FindCashSessionByEmployeeIdUseCase } from '../../../../../features/cash/application/use-cases/find-cash-session-by-employee-id.use-case';
import { EmployeeEntity } from '@/features/employee/domain/entities/employee.entity';

export async function findCashSessionByEmployeeIdAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new FindCashSessionByEmployeeIdUseCase(repository);
        
        const cookieStore = await cookies();
                
        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as EmployeeEntity).employeeId;
        }
        const result = await useCase.execute(employeeId);

        return {
            ...result
        }
    } catch (error) {
        throw error;
    }
}