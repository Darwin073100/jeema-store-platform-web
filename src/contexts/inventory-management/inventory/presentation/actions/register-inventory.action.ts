'use server'
import { revalidatePath } from "next/cache";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { InventoryRegisterDto } from "../../application/dtos/inventory-register.dto";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { RegisterInventoryUseCase } from "../../application/use-case/register-inventory.use-case";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { Result } from "@/shared/features/result";
import { InventoryMapper } from "../../application/mapper/inventory.mapper";

export async function registerInventoryAction(dto: InventoryRegisterDto) {
    try {
        const inventoryRepository = await TypeormInventoryRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();

        const registerInventoryUseCase = new RegisterInventoryUseCase(inventoryRepository, productRepository, branchOfficeRepository);

        const result = await registerInventoryUseCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success(InventoryMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('registerInventoryAction: ', error);
        return {
            ...handleError(error, 'registerInventoryAction')
        }
    }
}