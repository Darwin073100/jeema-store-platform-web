'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { FilterTopRequestDTO } from '../../application/dtos/filter-top.dto';
import { FindTopProductsByBranchOfficeUseCase } from '../../application/use-cases/find-top-products-by-branch-office.use-case';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { cookies } from 'next/headers';

export async function findTopProductsByBranchOfficeAction(filter: FilterTopRequestDTO){
    noStore(); // Evitar que se cachée este server action
    try {
            const productRepo = await TypeOrmProductRepository.create();
    
            const useCase = new FindTopProductsByBranchOfficeUseCase(productRepo);
            const cookieStore = await cookies();
            let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
            let branchOfficeId = BigInt(0);
            if (branchOffice) {
                branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
            }
    
            const result = await useCase.execute(branchOfficeId, filter.filterBy, filter.limit);
            return result;
        } catch (error) {
            console.log('findTopProductsByBranchOfficeAction');
            return []
        }
}