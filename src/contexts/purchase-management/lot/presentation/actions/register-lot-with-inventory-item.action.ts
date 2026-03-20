'use server'
import { revalidatePath } from "next/cache";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { RegisterLotWithInventoryItemUseCase } from "../../application/use-case/register-lot-with-inventory-item.use-case";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { AddInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";
import { RegisterLotDto } from "../../application/dtos/register-lot.dto";
import { Result } from "@/shared/features/result";
import { LotMapper } from "../../application/mappers/lot.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerLotWithInventoryItemAction(dto: RegisterLotDto, itemId: bigint) {
    try {
        const lotRepository = await TypeOrmLotRepository.create();
        const inventoryRepository = await TypeormInventoryItemRepository.create();
        const addInventoryItemUseCase = new AddInventoryItemUseCase(inventoryRepository);
        const useCase = new RegisterLotWithInventoryItemUseCase(lotRepository, addInventoryItemUseCase);

        const result = await useCase.execute(dto, itemId);

        revalidatePath('/products');

        return {
            ...Result.success(LotMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerLotWithInventoryItemAction: ', error);
        return {
            ...handleError(error, 'registerLotWithInventoryItemAction')
        }
    }
}