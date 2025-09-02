'use server'
import { RegisterInventoryItemDTO } from "../application/dtos/register-inventory-item.dto";
import { RegisterInventoryItemUseCase } from "../application/use-case/register-inventory-item.use-case";
import { InventoryItemFetchRepositoryImpl } from "../infraestructura/repositories/inventory-item.fetch.repository.impl";

export async function registerInventoryItemAction(dto: RegisterInventoryItemDTO){
    const inventoryFetchRepositoryImpl = new InventoryItemFetchRepositoryImpl();
    const registerInventoryItemUseCase = new RegisterInventoryItemUseCase(inventoryFetchRepositoryImpl);

    const result = await registerInventoryItemUseCase.execute(dto);
    return {
        ...result
    }
}