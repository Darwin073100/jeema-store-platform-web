'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { FindAllCashRegisterByBranchOfficeIdUseCase } from '../../../../../features/cash/application/use-cases/find-all-cash-register-by-branch-office-id.use-case';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';

export async function findAllCashRegisterByBranchOfficeIdAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new FindAllCashRegisterByBranchOfficeIdUseCase(repository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const result = await useCase.execute(branchOfficeId);

        return {
            ...result
        }
    } catch (error) {
        console.error('Error in ViewAllCategoriesAction:', error);
        throw error;
    }
}