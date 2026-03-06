'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';import { cookies } from 'next/headers';
import { TransactionRepositoryFactory } from '../infraestructure/factories/transaction-repository.factory';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { RegisterTransactionDTO } from '../application/dtos/register-transaction.dto';
import { EmployeeEntity } from '@/features/employee/domain/entities/employee.entity';
import { RegisterTransactionUseCase } from '../application/use-cases/register-transaction.use-case';

export async function registerTransactionAction(dto: Omit<RegisterTransactionDTO, 'employeeId'|'branchOfficeId'>){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= TransactionRepositoryFactory.create();
        const useCase = new RegisterTransactionUseCase(repository);
        
        const cookieStore = await cookies();
                
        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as EmployeeEntity).employeeId;
        }
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
        }

        const currentDTO: RegisterTransactionDTO = {
            ...dto,
            employeeId,
            branchOfficeId
        }
        const result = await useCase.execute(currentDTO);
        if(result){
            revalidatePath('/cash');
            revalidatePath('/configurations/transactions');
        }
        return {
            ...result
        }
    } catch (error) {
        console.error('findAllManyFilterTransactionsAction:', error);
        throw error;
    }
}