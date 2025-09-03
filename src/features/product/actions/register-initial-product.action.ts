'use server'
import { revalidatePath } from 'next/cache';
import { RegisterInitialProductDTO } from "../application/dtos/register-initial-product.dto";
import { RegisterProductUseCase } from "../application/use-case/register-product.use-case";
import { ProductRepositoryFactory } from "../infraestructure/factories/product-repository.factory";

export async function registerInitialProductAction(dto:RegisterInitialProductDTO){
    // ✅ Usando DI - Las dependencias se inyectan automáticamente
    const productRepository = ProductRepositoryFactory.create();
    
    const registerProductUseCase = new RegisterProductUseCase(
        productRepository,
    );

    const result = await registerProductUseCase.execute(dto);

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