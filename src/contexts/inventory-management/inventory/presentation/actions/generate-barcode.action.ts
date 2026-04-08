'use server'
import { cookies } from "next/headers";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { TypeormInventoryRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-inventory.repository";
import { GenerateBarcodeUseCase } from "../../application/use-case/generate-barcode.use-case";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function generateBarcodeAction(): Promise<{
    ok: boolean;
    value?: {barcode: string};
    error?: ErrorEntity | undefined;
}> {
    try {
        const inventoryRepository = await TypeormInventoryRepository.create();
        const productRepository = await TypeOrmProductRepository.create();
        const useCase = new GenerateBarcodeUseCase(inventoryRepository, productRepository);

        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }

        const result = await useCase.execute(establishmentId, branchOfficeId);
        console.log(result);
        return {
            ...Result.success<{barcode: string}>({barcode: result})
        }
    } catch (error) {
        console.error('generateBarcodeAction: ', error);
        return {
            ...handleError(error, 'generateBarcodeAction')
        }
    }
}