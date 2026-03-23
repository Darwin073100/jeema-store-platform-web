'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';import { cookies } from 'next/headers';
import { RegisterTransactionDTO } from '../../application/dtos/register-transaction.dto';
import { RegisterTransactionUseCase } from '../../application/use-cases/register-transaction.use-case';
import { TypeormTransactionRepository } from '../../infraestructure/repositories/typeorm-transaction.repository';
import { TypeormTransactionTypeRepository } from '@/contexts/transaction-management/transaction-type/infraestructure/repositories/typeorm-transaction-type.repository';
import { TypeOrmBranchOfficeRepository } from '@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository';
import { TypeormSaleRepository } from '@/contexts/sale-management/sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository';
import { TypeOrmEmployeeRepository } from '@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository';
import { TypeormCashSessionRepository } from '@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository';
import { IEmployee } from '@/contexts/employee-management/employee/presentation/interfaces/IEmployee';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { Result } from '@/shared/features/result';
import { TransactionMapper } from '../../application/mappers/transaction.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function registerTransactionAction(dto: Omit<RegisterTransactionDTO, 'employeeId'|'branchOfficeId'>){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= await TypeormTransactionRepository.create();
        const transactionTypeRepository = await TypeormTransactionTypeRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const saleRepository = await TypeormSaleRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const cashSessionRepository = await TypeormCashSessionRepository.create();
        const useCase = new RegisterTransactionUseCase(
            repository, transactionTypeRepository, branchOfficeRepository, saleRepository, 
            employeeRepository, cashSessionRepository
        );
        
        const cookieStore = await cookies();
                
        let employee = cookieStore.get('employeeCookie')?.value ?? null;
        let employeeId = BigInt(0);
        if (employee) {
            employeeId = (JSON.parse(employee) as IEmployee).employeeId;
        }
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
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
            ...Result.success(TransactionMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('findAllManyFilterTransactionsAction:', error);
        return {
            ...handleError(error, 'findAllManyFilterTransactionsAction')
        }
    }
}