"use server"
import { ViewAllInventoryItemUseCase } from "../application/use-case/view-all-inventory-item.use-case";
import { InventoryItemFetchRepositoryImpl } from "../infraestructura/repositories/inventory-item.fetch.repository.impl"

export async function viewAllInventoryItem(){
    // Inyección de las dependencias
    const inventoryItemFetchRepositoryImpl = new InventoryItemFetchRepositoryImpl();
    const viewAllInventoryItemUseCase = new ViewAllInventoryItemUseCase(inventoryItemFetchRepositoryImpl);

    const result = await viewAllInventoryItemUseCase.execute();

    return {
        ...result
    };
}