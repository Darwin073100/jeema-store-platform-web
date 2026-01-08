'use server'
import { cookies } from "next/headers";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { ReturnsRepositoryFactory } from "../infraestructure/factories/returns-repository.factory";
import { FindReturnsByBranchOfficeUseCase } from "../application/use-cases/find-returns-by-branch-office.use-case";
import { unstable_noStore } from "next/cache";

unstable_noStore();

export async function findReturnsByBranchOfficeAction(){
    const repository = ReturnsRepositoryFactory.create();
    const useCase = new FindReturnsByBranchOfficeUseCase(repository);

    const cookieStore = await cookies();                  
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }
    const result = await useCase.execute(branchOfficeId);
    return {
        ...result
    }
}