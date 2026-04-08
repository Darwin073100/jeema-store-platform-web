'use server'
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { revalidatePath } from 'next/cache';
import { Result } from '@/shared/lib/utils/result';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';

export async function deleteProductAction(productId: bigint){
    try{
        const repository = await TypeOrmProductRepository.create();
        const useCase = new DeleteProductUseCase(repository);

        const result = await useCase.execute(productId);
        // Invalidar el caché de la página de productos para que se actualicen los datos
        if (result) {
            revalidatePath('/products');
            return {...Result.success(result)};
        } else {
            return {...Result.failure<ErrorEntity>({
                error: 'Error',
                message: 'No se pudo eliminar el producto.',
                path: 'deleteProductAction',
                statusCode: 500,
                timestamp: new Date().toString()
            })};
        }
    } catch(error: any){
        console.error('deleteProductAction: ',error);
        return {...Result.failure<ErrorEntity>({
            error: 'Error',
            message: error.message,
            path: 'deleteProductAction',
            statusCode: 500,
            timestamp: new Date().toString()
        })};
    }
}