'use server'
import { revalidatePath } from "next/cache";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { DeleteLotUnitPurchaseUseCase } from "../../application/use-case/delete-lot-unit-purchase.use-case";
import { TypeormLotUnitPurchaseRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot-unit-purchase.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";

export async function deleteLotUniPurchaseAction(lotId: bigint, lotUnitPurchaseId: bigint) {
    try {
        const lotRepository = await TypeOrmLotRepository.create();
        const lotUnitPurchaseRepository = await TypeormLotUnitPurchaseRepository.create();
        const deleteLotUnitPurchaseUseCase = new DeleteLotUnitPurchaseUseCase(lotRepository, lotUnitPurchaseRepository);

        await deleteLotUnitPurchaseUseCase.execute(lotId, lotUnitPurchaseId);

        revalidatePath('/products');

        return {
            ...Result.success({})
        };
    } catch (error) {
        console.error('deleteLotUniPurchaseAction', error);
        return{
            ...handleError(error, 'deleteLotUniPurchaseAction')
        }
    }
}