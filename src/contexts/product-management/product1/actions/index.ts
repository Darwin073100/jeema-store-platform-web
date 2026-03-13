/**
 * Server Actions para Producto
 * Cada Server Action corresponde a un caso de uso específico
 * Estas funciones se ejecutan en el servidor de Next.js de forma segura
 * Se pueden llamar directamente desde componentes cliente
 */

'use server';

import { ProductResponseDto } from '../application/dtos/product-response.dto';
import { CreateProductDto } from '../application/dtos/create-product.dto';
import { UpdateProductDto } from '../application/dtos/update-product.dto';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { GetProductByIdUseCase } from '../application/use-cases/get-product-by-id.use-case';
import { GetAllProductsUseCase } from '../application/use-cases/get-all-products.use-case';
import { GetProductsByEstablishmentUseCase } from '../application/use-cases/get-products-by-establishment.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';

/**
 * Server Action: Crear un nuevo Producto
 * Caso de Uso: CreateProductUseCase
 */
export async function createProduct(input: CreateProductDto): Promise<ProductResponseDto> {
  try {
    const useCase = new CreateProductUseCase();
    return await useCase.execute(input);
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
}

/**
 * Server Action: Actualizar un Producto existente
 * Caso de Uso: UpdateProductUseCase
 */
export async function updateProduct(input: UpdateProductDto): Promise<ProductResponseDto> {
  try {
    const useCase = new UpdateProductUseCase();
    return await useCase.execute(input);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
}

/**
 * Server Action: Obtener un Producto por su ID
 * Caso de Uso: GetProductByIdUseCase
 */
export async function getProductById(productId: bigint): Promise<ProductResponseDto> {
  try {
    const useCase = new GetProductByIdUseCase();
    return await useCase.execute(productId);
  } catch (error) {
    console.error('Error en getProductById:', error);
    throw error;
  }
}

/**
 * Server Action: Obtener todos los Productos
 * Caso de Uso: GetAllProductsUseCase
 */
export async function getAllProducts(): Promise<ProductResponseDto[]> {
  try {
    const useCase = new GetAllProductsUseCase();
    return await useCase.execute();
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    throw error;
  }
}

/**
 * Server Action: Obtener Productos por Establecimiento
 * Caso de Uso: GetProductsByEstablishmentUseCase
 */
export async function getProductsByEstablishment(
  establishmentId: bigint
): Promise<ProductResponseDto[]> {
  try {
    const useCase = new GetProductsByEstablishmentUseCase();
    return await useCase.execute(establishmentId);
  } catch (error) {
    console.error('Error en getProductsByEstablishment:', error);
    throw error;
  }
}

/**
 * Server Action: Eliminar un Producto
 * Caso de Uso: DeleteProductUseCase
 */
export async function deleteProduct(productId: bigint): Promise<boolean> {
  try {
    const useCase = new DeleteProductUseCase();
    return await useCase.execute(productId);
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
}
