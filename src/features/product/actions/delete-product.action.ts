'use server'
import { revalidatePath } from 'next/cache';
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";
import { DeleteProductUseCase } from '../application/use-case/delete-product.use-case';

export async function deleteProductAction(productId: bigint){
    // ✅ Usando DI - Las dependencias se inyectan automáticamente
    const productRepository = ProductRepositoryFactory.create();
    
    const deleteProductUseCase = new DeleteProductUseCase(
        productRepository,
    );

    const result = await deleteProductUseCase.execute(productId);

    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }

    return {
        ...result
    }
}