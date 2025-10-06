'use server';
import { cookies } from "next/headers";
import { FindAllInventoryItemsByLocationAndBranchOfficeUseCase } from "../application/use-case/find-all-inventory-items-by-location-and-branch-office.use-case";
import { LocationEnum } from "../domain/enums/location.enum";
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";

export async function findAllInventoryItemsByLocationAndBranchOfficeAction(location?: LocationEnum) {
    const repositoryImpl =
        InventoryRepositoryFactory.create();
    const useCase =
        new FindAllInventoryItemsByLocationAndBranchOfficeUseCase(repositoryImpl);

    const cookieStore = await cookies();
    let branchOffice;
    if (cookieStore.has('branchOfficeCookie')) {
        branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        if (branchOffice) {
            branchOffice = JSON.parse(branchOffice) as BranchOfficeEntity;
            console.log(branchOffice);
            const result = await useCase.execute(branchOffice.branchOfficeId, location);
            return {
                ...result
            }
        }
    } else {
        const result = await useCase.execute(BigInt(0), location);
        return {
            ...result
        }
    }
}