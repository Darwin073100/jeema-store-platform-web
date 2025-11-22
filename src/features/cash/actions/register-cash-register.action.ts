'use server'
import { CashFetchRepositoryFactory } from '../infraestructure/factories/cash-fetch-repository.factory';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { RegisterCashRegisterDTO } from '../application/dtos/register-cash-register.dto';
import { RegisterCashRegisterUseCase } from '../application/use-cases/register-cash-register.use-case';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function registerCashRegisterAction(name: string){

    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository= CashFetchRepositoryFactory.create();
        const useCase = new RegisterCashRegisterUseCase(repository);
        
        const cookieStore = await cookies();
                
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
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