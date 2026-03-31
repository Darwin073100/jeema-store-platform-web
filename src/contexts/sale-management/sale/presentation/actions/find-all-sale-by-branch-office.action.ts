'use server';
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { FindAllByBranchOfficeSaleUseCase } from "../../application/use-cases/find-all-by-branch-office-sale.use-case";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/features/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";

export async function findAllSaleByBranchOfficeAction() {
    try {
        noStore();
        const repository = await TypeormSaleRepository.create();
        const useCase = new FindAllByBranchOfficeSaleUseCase(repository);

        const cookieStore = await cookies();
        let branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value;
        let branchOfficeId = BigInt(0);

        if (branchOfficeCookie) {
            const branchOfficeJSON = JSON.parse(branchOfficeCookie ?? '{}') as IBranchOffice;
            branchOfficeId = branchOfficeJSON.branchOfficeId;
        }

        const result = await useCase.execute(branchOfficeId);

        return {
            ...Result.success({sales: result.map(item => SaleMapper.toIResponse(item))})
        }
    } catch (error) {
        console.error({error});
        return {
            ...Result.success({sales: []})
        }
    }
}