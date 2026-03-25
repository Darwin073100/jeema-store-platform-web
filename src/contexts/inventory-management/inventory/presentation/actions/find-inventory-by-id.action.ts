'use server';
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { InventoryNotFoundException } from "../../domain/exceptions/inventory-not-found.exception";
import { FindInventoryByIdUseCase } from "../../application/use-case/find-inventory-by-id.use-case";

export async function findInventoryByIdAction(inventoryId: bigint) {
    try {
        const inventoryFetchRepositoryImpl = await TypeormInventoryRepository.create();
        const findInventoryByBarCodeUseCase = new FindInventoryByIdUseCase(inventoryFetchRepositoryImpl);

        const result = await findInventoryByBarCodeUseCase.execute(inventoryId);
        if(!result){
            throw new InventoryNotFoundException('No se encontro el inventario.');
        }
        return {
            ...Result.success(InventoryMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('generateBarcodeAction: ', error);
        return {
            ...handleError(error, 'generateBarcodeAction')
        }
    }
}