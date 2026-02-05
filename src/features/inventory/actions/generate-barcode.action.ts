'use server'
import { InventoryRepositoryFactory } from "../infraestructura/factories/inventory-repository.factory";
import { cookies } from "next/headers";
import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { GenerateBarcodeUseCase } from "../application/use-case/generate-barcode.use-case";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";

export async function generateBarcodeAction(){
    const inventoryFetchRepository = InventoryRepositoryFactory.create();
    const useCase = new GenerateBarcodeUseCase(inventoryFetchRepository);

     const cookieStore = await cookies();
            
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }
    const result = await useCase.execute(establishmentId, branchOfficeId);
    return {
        ...result
    }
}