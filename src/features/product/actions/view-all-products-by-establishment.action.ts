'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { ViewAllProductsByEstablishmentUseCase } from '../application/use-case/view-all-products-by-establishment.use-case';

export async function viewAllProductsByEstablishmentAction(){
    noStore(); // Evitar que se cachée este server action
    
    try {
        // ✅ Usando DI - Las dependencias se inyectan automáticamente
        const productRepository = ProductRepositoryFactory.create();
        const viewAllProductsUseCase = new ViewAllProductsByEstablishmentUseCase(productRepository);

        const cookieStore = await cookies();
                        
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        const result = await viewAllProductsUseCase.execute(establishmentId);
        
        return {
            ...result
        }
    } catch (error) {
        console.error('❌ Error en viewAllProductsAction:', error);
        throw error;
    }
}