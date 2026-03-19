'use server'
import { revalidatePath } from "next/cache";
import { UpdateLotUnitPurchaseDTO } from "../../application/dtos/update-lot-unit-purchase.dto";
import { TypeormLotUnitPurchaseRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot-unit-purchase.repository";
import { UpdateLotUnitPurchaseUseCase } from "../../application/use-case/update-lot-unit-purchase.use-case";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { Result } from "@/shared/features/result";
import { LotUnitPurchaseMapper } from "../../application/mappers/lot-unit-purchase.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function updateLotUniPurchaseAction(dto: UpdateLotUnitPurchaseDTO) {
    try {
        const lotUnitPurchaseRepository = await TypeormLotUnitPurchaseRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const updateLotUnitPurchaseUseCase = new UpdateLotUnitPurchaseUseCase(lotUnitPurchaseRepository, lotRepository);

        const result = await updateLotUnitPurchaseUseCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success(LotUnitPurchaseMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('updateLotUniPurchaseAction :',error);
        return {
            ...handleError(error, 'updateLotUniPurchaseAction')
        }
    }
}