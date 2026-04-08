'use server'
import { UpdateInventoryItemDto } from "@/contexts/inventory-management/inventory-item/application/dtos/update-inventory-item.dto";
import { UpdateInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/update-inventory-item.use-case";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { revalidatePath } from "next/cache";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { Result } from "@/shared/lib/utils/result";
import { InventoryItemMapper } from "@/contexts/inventory-management/inventory-item/application/mapper/inventory-item.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function updateInventoryItemAction(dto: UpdateInventoryItemDto) {
    try {
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const useCase = new UpdateInventoryItemUseCase(inventoryItemRepository, inventoryRepository);

        const result = await useCase.execute(dto);

        revalidatePath('/products')

        return {
            ...Result.success(InventoryItemMapper.toIResponse(result))
        }
    } catch (error) {
        console.log('updateInventoryItemAction: ', error);
        return {
            ...handleError(error, 'updateInventoryItemAction')
        }
    }
}