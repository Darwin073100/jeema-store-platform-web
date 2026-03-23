'use server';
import { cookies } from "next/headers";
import { FindAllSaleByBranchOfficeUseCase } from "../../../../../features/sale/application/use-case/find-all-sale-by-branch-office.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { unstable_noStore as noStore } from "next/cache";

export async function findAllSaleByBranchOfficeAction(){
    noStore();
    const repository = SaleRepositoryFactory.create();
    const useCase = new FindAllSaleByBranchOfficeUseCase(repository);

    const cookieStore = await cookies();
    let branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value;
    let branchOfficeId = BigInt(0);

    if(branchOfficeCookie){
        const branchOfficeJSON = JSON.parse(branchOfficeCookie ?? '{}') as BranchOfficeEntity;
        branchOfficeId = branchOfficeJSON.branchOfficeId; 
    }
    
    const result = await useCase.execute(branchOfficeId);

    return {
        ...result
    }
}