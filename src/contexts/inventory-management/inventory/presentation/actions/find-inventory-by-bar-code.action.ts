'use server';
import { FindInventoryByBarCodeUseCase } from "../../../../../features/inventory/application/use-case/find-inventory-by-bar-code.use-case";
import { InventoryRepositoryFactory } from "../../../../../features/inventory/infraestructura/factories/inventory-repository.factory";

export async function findInventoryByBarCodeAction(barCode: string) {
    const inventoryFetchRepositoryImpl = InventoryRepositoryFactory.create();
    const findInventoryByBarCodeUseCase = new FindInventoryByBarCodeUseCase(inventoryFetchRepositoryImpl);
    
    const result = await findInventoryByBarCodeUseCase.execute(barCode);
    
    return {
        ...result
    };
}