'use server'
import { cookies } from "next/headers";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { SearchCandidateProductsForCloudTransferItemUseCase } from "../../application/use-cases/search-candidate-products-for-cloud-transfer-item.use-case";
import { ProductMapper } from "@/contexts/product-management/product/application/mappers/product.mapper";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function searchCandidateProductsForCloudTransferItemAction(
    searchText: string,
): Promise<{ ok: boolean; value?: IProduct[]; error?: ErrorEntity }> {
    try {
        const productRepository = await TypeOrmProductRepository.create();
        const useCase = new SearchCandidateProductsForCloudTransferItemUseCase(productRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const establishmentId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).establishmentId : BigInt(0);

        const result = await useCase.execute({ establishmentId, searchText });

        return { ok: true, value: result.map(item => ProductMapper.toIResponse(item)) };
    } catch (error) {
        console.error('searchCandidateProductsForCloudTransferItemAction: ', error);
        return {
            ...handleError(error, 'searchCandidateProductsForCloudTransferItemAction'),
        };
    }
}
