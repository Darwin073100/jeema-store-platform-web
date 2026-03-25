'use server'
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { TypeormCashRegisterRepository } from '../../infraestructure/repositories/typeorm-cash-register.repository';
import { RegisterCashRegisterUseCase } from '../../application/use-cases/register-cash-register.use-case';
import { TypeOrmBranchOfficeRepository } from '@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository';
import { Result } from '@/shared/features/result';
import { CashRegisterMapper } from '../../application/mappers/cash-register.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function registerCashRegisterAction(name: string){
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormCashRegisterRepository.create();
        const branchRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new RegisterCashRegisterUseCase(repository, branchRepository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const result = await useCase.execute({
            name,
            branchOfficeId
        });
        revalidatePath('/cash');
        return {
            ...Result.success(CashRegisterMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('registerCashRegisterAction: ', error);
        return {
            ...handleError(error, 'registerCashRegisterAction')
        }
    }
}