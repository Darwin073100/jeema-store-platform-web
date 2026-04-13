'use server';
import { TypeormInventoryItemRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { SearchInventoryItemInformationUseCase } from "../../application/use-case/search-inventory-item-information.use-case";
import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { Result } from "@/shared/lib/utils/result";
import { InventoryItemMapper } from "../../application/mapper/inventory-item.mapper";

export async function searchInventoryItemInformationAction(inventoryId: bigint, barcode: string) {
    try {
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const useCase = new SearchInventoryItemInformationUseCase(inventoryItemRepository);

        const result = await useCase.execute(inventoryId, barcode);
        if (!result) {
            throw new InventoryItemNotFoundException('El item de inventario no se encontró.');
        }
        return {
            ...Result.success(InventoryItemMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'searchInventoryItemInformationAction')
        }

    }
}