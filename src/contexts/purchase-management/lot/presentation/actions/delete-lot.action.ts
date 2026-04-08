'use server'
import { revalidatePath } from "next/cache";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { DeleteLotUseCase } from "../../application/use-case/delete-lot.use-case";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";

export async function deleteLotAction(lotId: bigint) {
    try {
        const lotFetchRepositoryImpl = await TypeOrmLotRepository.create();
        const deleteLotUseCase = new DeleteLotUseCase(lotFetchRepositoryImpl);

        await deleteLotUseCase.execute(lotId);

        revalidatePath('/products');

        return {
            ...Result.success(undefined)
        };
    } catch (error) {
        console.error('deleteLotAction: ', error);
        return {
            ...handleError(error, 'deleteLotAction')
        }
    }
}