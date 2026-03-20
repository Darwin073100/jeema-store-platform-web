'use server'
import { cookies } from "next/headers";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { FindReportLotsUseCase } from "../../application/use-case/find-report-lots.use-case";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { Result } from "@/shared/features/result";
import { LotMapper } from "../../application/mappers/lot.mapper";

export async function findReportsLotsAction(dateInit: Date | null, dateFinish: Date | null) {
    try {
        const lotFetchRepositoryImpl = await TypeOrmLotRepository.create();
        const useCase = new FindReportLotsUseCase(lotFetchRepositoryImpl);

        const cookieStore = await cookies();
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as IBranchOffice).branchOfficeId;
        }

        const result = await useCase.execute(branchOfficeId, { dateFinish, dateInit });

        return {
            ...Result.success({lots: result.map(item => LotMapper.toIResponse(item))})
        };
    } catch (error) {
        console.error('findReportsLotsAction: ', error);
        return {
            ...Result.success({lots:[]})
        }
    }
}