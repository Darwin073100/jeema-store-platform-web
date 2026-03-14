'use server'
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ViewAllProductsByEstablishmentUseCase } from '../../application/use-cases/view-all-products-by-establishment.use-case';
import { ProductMapper } from '../../application/mappers/product.mapper';

export async function findAllProductsByEstablishmentAction(){
    try{
        const repository = await TypeOrmProductRepository.create();
        const useCase = new ViewAllProductsByEstablishmentUseCase(repository);

        noStore(); // Evitar que se cachée este server action
        const cookieStore = await cookies();
               
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        const result = await useCase.execute(establishmentId);
        return result.map(item => ProductMapper.toIResponse(item));
    } catch(error){
        return [];
    }
}