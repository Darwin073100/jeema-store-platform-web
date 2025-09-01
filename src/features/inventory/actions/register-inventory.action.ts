import { revalidatePath } from "next/cache";
import { RegisterInventoryDTO } from "../application/dtos/register-inventory.dto";
import { RegisterInventoryUseCase } from "../application/use-case/register-inventory.use-case";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";

export async function registerInventoryAction(dto: RegisterInventoryDTO){
    const inventoryFetchRepository = InventoryRepositoryFactory.create();
    const registerInventoryUseCase = new RegisterInventoryUseCase(inventoryFetchRepository);

    const result = await registerInventoryUseCase.execute(dto);
    
    revalidatePath('/products');

    return {
        ...result
    }
}