'use server'
import { revalidatePath } from "next/cache";
import { RegisterLotDTO } from "../../../../../features/lot/application/dtos/register-lot.dto";
import { LotRepositoryFactory } from "../../../../../features/lot/infraestructure/factories/lot-repository.factory";
import { RegisterLotWithInventoryItemUseCase } from "../../../../../features/lot/application/use-case/register-lot-with-inventory-item.use-case";

export async function registerLotWithInventoryItemAction(dto: RegisterLotDTO, itemId: bigint){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const inventoryRepository = undefined;
    const useCase = new RegisterLotWithInventoryItemUseCase(lotFetchRepositoryImpl, inventoryRepository);

    const result = await useCase.execute(dto, itemId);
    if(!!result.ok){
        revalidatePath('/products');
    }
    return {
        ...result
    };
}