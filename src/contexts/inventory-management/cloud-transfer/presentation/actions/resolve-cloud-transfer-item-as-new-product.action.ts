'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeormCategoryRepository } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository";
import { TypeOrmBrandRepository } from "@/contexts/product-management/brand/infraestruture/persistence/typeorm/repositories/typeorm-brand.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { ResolveCloudTransferItemAsNewProductUseCase } from "../../application/use-cases/resolve-cloud-transfer-item-as-new-product.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransferItem } from "../interfaces/ICloudTransferItem";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function resolveCloudTransferItemAsNewProductAction(
    dto: {
        cloudTransferItemId: bigint;
        localCategoryId: bigint;
        localBrandId?: bigint;
        internalBarCode?: string | null;
        salePriceOne?: number | null;
        salePriceMany?: number | null;
        saleQuantityMany?: number | null;
        salePriceSpecial?: number | null;
        minStockBranch?: number | null;
        maxStockBranch?: number | null;
    },
): Promise<{ ok: boolean; value?: ICloudTransferItem; error?: ErrorEntity }> {
    try {
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const categoryRepository = await TypeormCategoryRepository.create();
        const brandRepository = await TypeOrmBrandRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();

        const useCase = new ResolveCloudTransferItemAsNewProductUseCase(
            cloudTransferItemRepository, productRepository, categoryRepository, brandRepository, inventoryRepository,
        );

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOffice = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice) : null;
        const branchOfficeId = branchOffice?.branchOfficeId ?? BigInt(0);
        const establishmentId = branchOffice?.establishmentId ?? BigInt(0);

        const result = await useCase.execute({ ...dto, branchOfficeId, establishmentId });

        revalidatePath('/products');

        return { ok: true, value: CloudTransferMapper.itemToIResponse(result) };
    } catch (error) {
        console.error('resolveCloudTransferItemAsNewProductAction: ', error);
        return {
            ...handleError(error, 'resolveCloudTransferItemAsNewProductAction'),
        };
    }
}
