'use server'
import { revalidatePath } from "next/cache";
import { TypeOrmSuplierRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository";
import { Result } from "@/shared/lib/utils/result";
import { SuplierMapper } from "../../application/mappers/suplier.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { UpdateSuplierDto } from "../../application/dtos/update-suplier.dto";
import { UpdateSuplierUseCase } from "../../application/use-cases/update-suplier.use-case";

export async function updateSuplierAction(dto: UpdateSuplierDto) {
    try {
        const suplierRepository = await TypeOrmSuplierRepository.create();
        const useCase = new UpdateSuplierUseCase(suplierRepository);

        const result = await useCase.execute(dto);

        revalidatePath('/purchases/supliers');

        return {
            ...Result.success(SuplierMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'updateSuplierAction')
        }
    }
}