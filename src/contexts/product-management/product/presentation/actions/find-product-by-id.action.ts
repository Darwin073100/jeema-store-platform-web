'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductMapper } from '../../application/mappers/product.mapper';
import { ViewProductByIdUseCase } from '../../application/use-cases/view-product-by-id.use-case';

export async function findAllProductByIdAction(productId: bigint){
    try{
        const repository = await TypeOrmProductRepository.create();
        const useCase = new ViewProductByIdUseCase(repository);

        noStore(); // Evitar que se cachée este server action

        const result = await useCase.execute(productId);
        return result? ProductMapper.toIResponse(result): null;
    } catch(error){
        console.log(error);
        return null;
    }
}