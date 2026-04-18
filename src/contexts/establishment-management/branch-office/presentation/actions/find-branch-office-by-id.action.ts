import { Result } from "@/shared/lib/utils/result";
import { FindBranchOfficeByIdUseCase } from "../../application/use-cases/find-branch-office-by-id.use-case";
import { TypeOrmBranchOfficeRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { BranchOfficeMapper } from "../../application/mappers/branch-office.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { IBranchOffice } from "../interfaces/IBranchOffice";

export async function findBranchOfficeByIdAction(branchOfficeId: bigint): Promise<{
    ok: boolean;
    value?: IBranchOffice;
    error?: ErrorEntity;
}> {
    try {
        const repository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new FindBranchOfficeByIdUseCase(repository);

        const result = await useCase.execute(branchOfficeId);
        if(!result){
            throw new Error();
        }
        return {
            ...Result.success(BranchOfficeMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'findBranchOfficeByIdAction')
        }
    }
}