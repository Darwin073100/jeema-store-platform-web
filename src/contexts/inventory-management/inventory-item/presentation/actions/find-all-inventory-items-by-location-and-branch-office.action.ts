'use server';
import { cookies } from "next/headers";
import { LocationEnum } from "../../domain/enums/location.enum";
import { TypeormInventoryItemRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/features/result";
import { FindByLocationAndBranchOfficeItemUseCase } from "../../application/use-case/find-by-location-and-branch-office-item.use-case";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { InventoryItemMapper } from "../../application/mapper/inventory-item.mapper";

export async function findAllInventoryItemsByLocationAndBranchOfficeAction(location?: LocationEnum) {
    try {
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const branchRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new FindByLocationAndBranchOfficeItemUseCase(branchRepository, inventoryItemRepository);

        const cookieStore = await cookies();
        let branchOffice;
        if (cookieStore.has('branchOfficeCookie')) {
            branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
            if (branchOffice) {
                branchOffice = JSON.parse(branchOffice) as IBranchOffice;

                const result = await useCase.execute(branchOffice.branchOfficeId, location?.toString() ?? null);
                return {
                    ...Result.success({ items: result.map(item => InventoryItemMapper.toIResponse(item)) })
                }
            }
        } else {
            return {
                ...Result.success({ items: [] })
            }
        }
    } catch (error) {
        console.error({ error });
        return {
            ...Result.success({ items: [] })
        }

    }
}