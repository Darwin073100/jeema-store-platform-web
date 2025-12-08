'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";
import { cookies } from 'next/headers';
import { ViewAllProductsByEstablishmentUseCase } from '../application/use-case/view-all-products-by-establishment.use-case';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { FilterTopRequestDTO } from '../application/dtos/filter-top.dto';
import { FindTopProductsByBranchOfficeUseCase } from '../application/use-case/products-top-by-branch-office.use-case';

export async function findTopProductsByBranchOfficeAction(filter: FilterTopRequestDTO){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // ✅ Usando DI - Las dependencias se inyectan automáticamente
        const productRepository = ProductRepositoryFactory.create();
        const useCase = new FindTopProductsByBranchOfficeUseCase(productRepository);

        const cookieStore = await cookies();
                        
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
        }
        const result = await useCase.execute(branchOfficeId, filter);
        
        return {
            ...result
        }
    } catch (error) {
        console.error('❌ Error en viewAllProductsAction:', error);
        throw error;
    }
}