'use server';
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/lib/utils/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";
import { SaleFilterDTO } from "../../application/dtos/sale-filter.dto";
import { FindAllByBranchOfficeSaleAndFilterUseCase } from "../../application/use-cases/find-all-by-branch-office-sale-and-filter.use-case";

export async function findAllSaleByBranchOfficeAndFilterAction(dto: Omit<SaleFilterDTO, 'branchOfficeId'>) {
    try {
        noStore();
        const repository = await TypeormSaleRepository.create();
        const useCase = new FindAllByBranchOfficeSaleAndFilterUseCase(repository);

        const cookieStore = await cookies();
        let branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value;
        let branchOfficeId = BigInt(0);

        if (branchOfficeCookie) {
            const branchOfficeJSON = JSON.parse(branchOfficeCookie ?? '{}') as IBranchOffice;
            branchOfficeId = branchOfficeJSON.branchOfficeId;
        }

        const result = await useCase.execute({
            ...dto,
            branchOfficeId
        });

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