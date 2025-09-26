'use server';
import { FindAllInventoryItemsByLocationAndBranchOfficeUseCase } from "../application/use-case/find-all-inventory-items-by-location-and-branch-office.use-case";
import { LocationEnum } from "../domain/enums/location.enum";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";

export async function findAllInventoryItemsByLocationAndBranchOfficeAction(branchOfficeId: bigint, location?: LocationEnum) {
    const repositoryImpl = 
        InventoryRepositoryFactory.create();
    const useCase = 
        new FindAllInventoryItemsByLocationAndBranchOfficeUseCase(repositoryImpl);
    
    const result = await useCase.execute(branchOfficeId, location);
    
    return {
        ...result
    };
}