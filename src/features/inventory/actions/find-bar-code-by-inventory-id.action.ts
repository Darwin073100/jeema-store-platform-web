'use server';
import { unstable_noStore } from "next/cache";
import { FindBarCodeByInventoryIdUseCase } from "../application/use-case/find-bar-code-by-inventory-id.use-case";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";

unstable_noStore();

export async function findBarCodeByInventoryIdAction(inventoryId: bigint) {
    const inventoryFetchRepositoryImpl = InventoryRepositoryFactory.create();
    const useCase = new FindBarCodeByInventoryIdUseCase(inventoryFetchRepositoryImpl);
    
    const result = await useCase.execute(inventoryId);
    
    return {
        ...result
    };
}