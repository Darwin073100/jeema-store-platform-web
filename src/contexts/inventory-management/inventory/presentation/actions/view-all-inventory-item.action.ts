"use server"
import { ViewAllInventoryItemUseCase } from "../../../../../features/inventory/application/use-case/view-all-inventory-item.use-case";
import { InventoryItemRepositoryFactory } from "../../../../../features/inventory/infraestructura/factories/inventory-item-repository.factory";

export async function viewAllInventoryItem(){
    // Inyección de las dependencias
    const inventoryItemFetchRepositoryImpl = InventoryItemRepositoryFactory.create();
    const viewAllInventoryItemUseCase = new ViewAllInventoryItemUseCase(inventoryItemFetchRepositoryImpl);

    const result = await viewAllInventoryItemUseCase.execute();

    return {
        ...result
    };
}