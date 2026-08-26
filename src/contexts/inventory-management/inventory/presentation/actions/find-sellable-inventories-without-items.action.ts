'use server';
import { cookies } from "next/headers";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/lib/utils/result";
import { FindSellableInventoriesWithoutItemsUseCase } from "../../application/use-case/find-sellable-inventories-without-items.use-case";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";
import { FilterProductListDTO } from "@/contexts/product-management/product/application/dtos/filter-product-list.dto";

export async function findSellableInventoriesWithoutItemsAction(dto?: FilterProductListDTO) {
    try {
        const inventoryRepository = await TypeormInventoryRepository.create();
        const branchRepository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new FindSellableInventoriesWithoutItemsUseCase(branchRepository, inventoryRepository);

        const cookieStore = await cookies();
        let branchOffice;
        if (cookieStore.has('branchOfficeCookie')) {
            branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
            if (branchOffice) {
                branchOffice = JSON.parse(branchOffice) as IBranchOffice;

                const result = await useCase.execute(branchOffice.branchOfficeId, { product: dto?.product });
                return {
                    ...Result.success({ items: result.map(item => InventoryMapper.toIResponse(item)) })
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
