'use server'
import { cookies } from "next/headers";
import { TypeormCloudTransferItemRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer-item.repository";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeormInventoryRepository } from "@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { ResolveCloudTransferItemAsExistingProductUseCase } from "../../application/use-cases/resolve-cloud-transfer-item-as-existing-product.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransferItem } from "../interfaces/ICloudTransferItem";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function resolveCloudTransferItemAsExistingProductAction(
    cloudTransferItemId: bigint,
    matchedLocalProductId: bigint,
): Promise<{ ok: boolean; value?: ICloudTransferItem; error?: ErrorEntity }> {
    try {
        const cloudTransferItemRepository = await TypeormCloudTransferItemRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const inventoryRepository = await TypeormInventoryRepository.create();
        const useCase = new ResolveCloudTransferItemAsExistingProductUseCase(cloudTransferItemRepository, productRepository, inventoryRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);

        const result = await useCase.execute({ cloudTransferItemId, matchedLocalProductId, branchOfficeId });

        return { ok: true, value: CloudTransferMapper.itemToIResponse(result) };
    } catch (error) {
        console.error('resolveCloudTransferItemAsExistingProductAction: ', error);
        return {
            ...handleError(error, 'resolveCloudTransferItemAsExistingProductAction'),
        };
    }
}
