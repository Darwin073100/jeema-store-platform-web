'use server'
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { RegisterCashRegisterDTO } from '../../../../../features/cash/application/dtos/register-cash-register.dto';
import { RegisterCashRegisterUseCase } from '../../../../../features/cash/application/use-cases/register-cash-register.use-case';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';

export async function registerCashRegisterAction(name: string){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new RegisterCashRegisterUseCase(repository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const dto: RegisterCashRegisterDTO = {
            name,
            branchOfficeId
        }
        const result = await useCase.execute(dto);
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