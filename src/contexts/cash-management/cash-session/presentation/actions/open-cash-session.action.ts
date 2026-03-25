'use server'
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OpenCashSessionDTO } from '../../application/dtos/open-cash-session.dto';
import { TypeormCashSessionRepository } from '../../infraestructure/repositories/typeorm-cash-session.repository';
import { OpenCashSessionUseCase } from '../../application/use-cases/open-cash-session.use-case';
import { TypeormCashRegisterRepository } from '@/contexts/cash-management/cash-register/infraestructure/repositories/typeorm-cash-register.repository';
import { TypeOrmEmployeeRepository } from '@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository';
import { TypeormTransactionRepository } from '@/contexts/transaction-management/transaction/infraestructure/repositories/typeorm-transaction.repository';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { IEmployee } from '@/contexts/employee-management/employee/presentation/interfaces/IEmployee';
import { Result } from '@/shared/features/result';
import { CashSessionMapper } from '../../application/mappers/cash-session.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function openCashSessionAction(dto: Omit<OpenCashSessionDTO, 'branchOfficeId' | 'employeeId'>){ 
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= await TypeormCashSessionRepository.create();
        const cashRegisterRepository = await TypeormCashRegisterRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const transactionRepository = await TypeormTransactionRepository.create();
        const useCase = new OpenCashSessionUseCase(repository, cashRegisterRepository, employeeRepository, transactionRepository);
        
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
        
        const currentDto: OpenCashSessionDTO = {
            ...dto,
            branchOfficeId,
            employeeId,
        }

        const result = await useCase.execute(currentDto);

        revalidatePath('/cash');

        return {
            ...Result.success(CashSessionMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'openCashSessionAction')
        }
    }
}