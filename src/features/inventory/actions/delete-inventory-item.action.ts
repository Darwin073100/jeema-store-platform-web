"use server"
import { revalidatePath } from "next/cache";
import { DeleteInventoryItemUseCase } from "../application/use-case/delete-inventory-item.use-case";
import { InventoryItemRepositoryFactory } from "../infraestructura/factories/inventory-item-repository.factory";

export async function deleteInventoryItemAction(inventoryItemId: bigint){
    // Inyección de las dependencias
    const inventoryItemFetchRepositoryImpl = InventoryItemRepositoryFactory.create();
    const deleteInventoryItemUseCase = new DeleteInventoryItemUseCase(inventoryItemFetchRepositoryImpl);

    const result = await deleteInventoryItemUseCase.execute(inventoryItemId);

    if(result?.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}