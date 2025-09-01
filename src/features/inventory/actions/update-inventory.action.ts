import { revalidatePath } from "next/cache";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";
import { UpdateInventoryUseCase } from "../application/use-case/update-inventory.use-case";
import { UpdateInventoryDTO } from "../application/dtos/update-inventory.dto";

export async function updateInventoryAction(dto: UpdateInventoryDTO){
    const inventoryFetchRepository = InventoryRepositoryFactory.create();
    const updateInventoryUseCase = new UpdateInventoryUseCase(inventoryFetchRepository);

    const result = await updateInventoryUseCase.execute(dto);
    
    revalidatePath('/products');

    return {
        ...result
    }
}