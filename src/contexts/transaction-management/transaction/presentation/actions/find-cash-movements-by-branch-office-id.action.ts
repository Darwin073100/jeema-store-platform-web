'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { ManyFilterTransactionsDTO } from '../../application/dtos/many-filter-transactions.dto';
import { TypeormTransactionRepository } from '../../infraestructure/repositories/typeorm-transaction.repository';
import { FindAllManyFilterTransactionsUseCase } from '../../application/use-cases/find-all-many-filter-transactions.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { Result } from '@/shared/features/result';
import { TransactionMapper } from '../../application/mappers/transaction.mapper';

export async function findAllManyFilterTransactionsAction(dto: Omit<ManyFilterTransactionsDTO, 'establishmentId'|'branchOfficeId'>){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = await TypeormTransactionRepository.create();
        const useCase = new FindAllManyFilterTransactionsUseCase(repository);
        
        const cookieStore = await cookies();
                
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }

        const currentDTO: ManyFilterTransactionsDTO = {
            ...dto,
            establishmentId,
            branchOfficeId
        }

        const result = await useCase.execute(currentDTO);

        return {
            ...Result.success({transactions: result.map(item => TransactionMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error('findAllManyFilterTransactionsAction:', error);
        return {
            ...Result.success({transactions: []})
        }
    }
}