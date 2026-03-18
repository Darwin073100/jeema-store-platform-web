'use server'
import { revalidatePath } from "next/cache";
import { Result } from "@/shared/features/result";
import { InventoryItemRegisterDto } from "@/contexts/inventory-management/inventory-item/application/dtos/inventory-item-register.dto";
import { RegisterInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/register-inventory-item.use-case";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { InventoryItemMapper } from "@/contexts/inventory-management/inventory-item/application/mapper/inventory-item.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerInventoryItemAction(dto: InventoryItemRegisterDto) {
    try {
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const registerInventoryItemUseCase = new RegisterInventoryItemUseCase(inventoryItemRepository, inventoryRepository);

        const result = await registerInventoryItemUseCase.execute(dto);

        revalidatePath('/products')

        return {
            ...Result.success(InventoryItemMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('registerInventoryItemAction: ', error);
        return {
            ...handleError(error, 'registerInventoryItemAction')
        }
    }
}