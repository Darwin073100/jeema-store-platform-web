'use server'
import { LotRepositoryFactory } from "../../../../../features/lot/infraestructure/factories/lot-repository.factory";
import { FindReportLotsUseCase } from "../../../../../features/lot/application/use-case/find-report-lots.use-case";
import { cookies } from "next/headers";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";

export async function findReportsLotsAction(dateInit: Date | null, dateFinish: Date | null){
    const lotFetchRepositoryImpl  = LotRepositoryFactory.create();
    const useCase = new FindReportLotsUseCase(lotFetchRepositoryImpl);

    const cookieStore = await cookies();                  
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }

    const result = await useCase.execute(branchOfficeId,{dateFinish, dateInit});

    return {
        ...result
    };
}