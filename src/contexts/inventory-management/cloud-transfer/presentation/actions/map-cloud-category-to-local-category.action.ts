'use server'
import { cookies } from "next/headers";
import { TypeormCategoryRepository } from "@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository";
import { MapCloudCategoryToLocalCategoryUseCase } from "../../application/use-cases/map-cloud-category-to-local-category.use-case";
import { CategoryMapper } from "@/contexts/product-management/category/application/mappers/category-mapper";
import { ICategory } from "@/contexts/product-management/category/presentation/interfaces/ICategory";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function mapCloudCategoryToLocalCategoryAction(
    dto: { localCategoryId?: bigint; newCategoryName?: string; newCategoryDescription?: string | null },
): Promise<{ ok: boolean; value?: ICategory; error?: ErrorEntity }> {
    try {
        const categoryRepository = await TypeormCategoryRepository.create();
        const useCase = new MapCloudCategoryToLocalCategoryUseCase(categoryRepository);

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const establishmentId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).establishmentId : BigInt(0);

        const result = await useCase.execute({ ...dto, establishmentId });

        return { ok: true, value: CategoryMapper.toIResponse(result) };
    } catch (error) {
        console.error('mapCloudCategoryToLocalCategoryAction: ', error);
        return {
            ...handleError(error, 'mapCloudCategoryToLocalCategoryAction'),
        };
    }
}
