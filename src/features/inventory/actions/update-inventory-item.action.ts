'use server'
import { revalidatePath } from "next/cache";
import { InventoryItemRepositoryFactory } from "../infraestructura/factories/inventory-item-repository.factory";
import { UpdateInventoryItemDTO } from "../application/dtos/update-inventory-item.dto";
import { UpdateInventoryItemUseCase } from "../application/use-case/update-inventory-item.use-case";

export async function updateInventoryItemAction(dto: UpdateInventoryItemDTO){
    const inventoryFetchRepositoryImpl = InventoryItemRepositoryFactory.create();
    const registerInventoryItemUseCase = new UpdateInventoryItemUseCase(inventoryFetchRepositoryImpl);

    const result = await registerInventoryItemUseCase.execute(dto);

    if(result.ok){
        revalidatePath('/products')
    }
    
    return {
        ...result
    }
}