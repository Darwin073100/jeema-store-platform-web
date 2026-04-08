'use server';
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { FindByInternalBarCodeInventoryUseCase } from "../../application/use-case/find-by-internal-barcode-inventory.use-case";
import { InventoryNotFoundException } from "../../domain/exceptions/inventory-not-found.exception";

export async function findInventoryByBarCodeAction(barCode: string) {
    try {
        const inventoryFetchRepositoryImpl = await TypeormInventoryRepository.create();
        const findInventoryByBarCodeUseCase = new FindByInternalBarCodeInventoryUseCase(inventoryFetchRepositoryImpl);

        const result = await findInventoryByBarCodeUseCase.execute(barCode);
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