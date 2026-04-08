"use server"
import { DeleteInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/delete-inventory-item.use-case";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { Result } from "@/shared/lib/utils/result";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { revalidatePath } from "next/cache";

export async function deleteInventoryItemAction(inventoryItemId: bigint) {
    try {
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const deleteInventoryItemUseCase = new DeleteInventoryItemUseCase(inventoryItemRepository);

        await deleteInventoryItemUseCase.execute(inventoryItemId);

        revalidatePath('/products');

        return {
            ...Result.success({})
        };
    } catch (error) {
        console.log('deleteInventoryItemAction: ', error);
        return {
            ...handleError(error, 'deleteInventoryItemAction')
        }
    }
}