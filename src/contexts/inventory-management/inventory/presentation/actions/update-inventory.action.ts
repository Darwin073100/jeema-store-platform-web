'use server'
import { revalidatePath } from "next/cache";
import { UpdateInventoryDto } from "../../application/dtos/update-inventory.dto";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { UpdateInventoryUseCase } from "../../application/use-case/update-inventory.use-case";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";
import { IInventory } from "../interfaces/IInventory";

export async function updateInventoryAction(dto: UpdateInventoryDto) {
    try {
        const inventoryRepo = await TypeormInventoryRepository.create();
        const productRepo = await TypeOrmProductRepository.create();
        const branchOfficeRepo = await TypeOrmBranchOfficeRepository.create();
        const updateInventoryUseCase = new UpdateInventoryUseCase(inventoryRepo, productRepo, branchOfficeRepo);

        const result = await updateInventoryUseCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success<IInventory>(InventoryMapper.toIResponse(result))
        }
    } catch (error) {
        console.log('updateInventoryAction: ', error);
        return {
            ...handleError(error, 'updateInventoryAction')
        }
    }
}