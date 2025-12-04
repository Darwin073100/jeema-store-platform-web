'use server'
import { ProductEntity } from "../domain/entities/product.entity";
import { Result } from "@/shared/features/result";

export const viewProductByIdAction = async (productId: bigint): Promise<Result<ProductEntity>> => {
    try {
        // Aquí iría la implementación real con tu servicio de productos
        // Por ahora voy a usar una implementación temporal que busque en tu API
        
        const response = await fetch(`${process.env.URL_EDYOF_PLATFORM_API}${process.env.PREFIX_EDYOF_PLATFORM_API}/products/${productId.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Para evitar cache en development
        });

        if (!response.ok) {
            return Result.failure(new Error(`Error al obtener el producto: ${response.statusText}`));
        }

        const product = await response.json();

        return Result.success(product);

    } catch (error) {
        console.error('Error in viewProductByIdAction:', error);
        return Result.failure(new Error(error instanceof Error ? error.message : 'Error desconocido al obtener el producto'));
    }
};
