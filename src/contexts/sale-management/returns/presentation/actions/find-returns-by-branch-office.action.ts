'use server'
import { cookies } from "next/headers";
import { unstable_noStore } from "next/cache";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { TypeormReturnsRepository } from "../../infraestructure/repositories/typeorm-returns.repository";
import { FindReturnsByBranchOfficeUseCase } from "../../application/use-cases/find-returns-by-branch-office.use-cases";
import { Result } from "@/shared/features/result";
import { ReturnsAppMapper } from "../../application/mappers/returns-app.mapper";

unstable_noStore();

export async function findReturnsByBranchOfficeAction() {
    try {
        const repository = await TypeormReturnsRepository.create();
        const useCase = new FindReturnsByBranchOfficeUseCase(repository);

        const cookieStore = await cookies();
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }
        const result = await useCase.execute(branchOfficeId);
        return {
            ...Result.success({returns: result.map(item => ReturnsAppMapper.toIResponse(item))})
        }
    } catch(error){
        console.error('findReturnsByBranchOfficeAction: ', error);
        return {
            ...Result.success({returns: []})
        }
    }
}