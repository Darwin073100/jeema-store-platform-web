'use server';
import { FindInventoryByBarCodeUseCase } from "../application/use-case/find-inventory-by-bar-code.use-case";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";

export async function findInventoryByBarCodeAction(barCode: string) {
    const inventoryFetchRepositoryImpl = InventoryRepositoryFactory.create();
    const findInventoryByBarCodeUseCase = new FindInventoryByBarCodeUseCase(inventoryFetchRepositoryImpl);
    
    const result = await findInventoryByBarCodeUseCase.execute(barCode);
    
    return {
        ...result
    };
}