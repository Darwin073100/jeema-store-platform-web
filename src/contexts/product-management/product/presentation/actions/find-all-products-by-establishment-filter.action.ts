'use server'
import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';
import { ProductMapper } from '../../application/mappers/product.mapper';
import { FilterProductListDTO } from '../../application/dtos/filter-product-list.dto';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ViewAllProductsByEstablishmentFilterUseCase } from '../../application/use-cases/view-all-products-by-establishment-filter.use-case';

export async function findAllProductsByEstablishmentFilterAction(dto: FilterProductListDTO){
    try{
        const repository = await TypeOrmProductRepository.create();
        const useCase = new ViewAllProductsByEstablishmentFilterUseCase(repository);

        noStore(); // Evitar que se cachée este server action
        const cookieStore = await cookies();
               
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;

        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute(establishmentId, dto);
        return result.map(item => ProductMapper.toIResponse(item));
    } catch(error){
        return [];
    }
}