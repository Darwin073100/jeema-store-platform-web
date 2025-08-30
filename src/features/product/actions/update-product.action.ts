'use server'
import { revalidatePath } from 'next/cache';
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";
import { UpdateProductDTO } from '../application/dtos/update-product.dto';
import { UpdateProductUseCase } from '../application/use-case/update-product.use-case';

export async function updateProductAction(dto:UpdateProductDTO){
    // ✅ Usando DI - Las dependencias se inyectan automáticamente
    const productRepository = ProductRepositoryFactory.create();
    
    const updateProductUseCase = new UpdateProductUseCase(
        productRepository,
    );

    const result = await updateProductUseCase.execute(dto);

    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }

    // // Invalidar el caché de la página de productos para que se actualicen los datos
    // if (result?.ok) {
    //     revalidatePath('/products');
    // }

    return {
        ...result
    }
}