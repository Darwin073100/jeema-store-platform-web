'use server'
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { UpdateBranchOfficeDto } from "../../application/dtos/update-branch-office.dto";
import { TypeOrmBranchOfficeRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { UpdateBranchOfficeUseCase } from "../../application/use-cases/update-branch-office.use-case";
import { revalidatePath } from "next/cache";
import { Result } from "@/shared/lib/utils/result";
import { BranchOfficeMapper } from "../../application/mappers/branch-office.mapper";

export async function UpdateBranchOfficeAction(dto: UpdateBranchOfficeDto){
    try{
        const repository = await TypeOrmBranchOfficeRepository.create();
        const useCase = new UpdateBranchOfficeUseCase(repository);

        const result = await useCase.execute(dto);
        revalidatePath('/configurations/establishment/branches');
        return {
            ...Result.success(BranchOfficeMapper.toIResponse(result))
        }
    }catch(error){
        return {
            ...handleError(error, 'UpdateBranchOfficeAction')
        }
    }
}