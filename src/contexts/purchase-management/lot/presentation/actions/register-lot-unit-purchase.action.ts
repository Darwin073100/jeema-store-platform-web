'use server'
import { revalidatePath } from "next/cache";
import { RegisterLotUnitPurchaseDTO } from "../../application/dtos/register-lot-unit-purchase.dto";
import { TypeormLotUnitPurchaseRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot-unit-purchase.repository";
import { RegisterLotUnitPurchaseUseCase } from "../../application/use-case/register-lot-unit-purchase.use-case";
import { TypeOrmLotRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-lot.repository";
import { Result } from "@/shared/lib/utils/result";
import { LotUnitPurchaseMapper } from "../../application/mappers/lot-unit-purchase.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerLotUniPurchaseAction(dto: RegisterLotUnitPurchaseDTO) {
    try {
        const lotUnitPurchaseRepository = await TypeormLotUnitPurchaseRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const registerLotUnitPurchaseUseCase = new RegisterLotUnitPurchaseUseCase(lotUnitPurchaseRepository, lotRepository);

        const result = await registerLotUnitPurchaseUseCase.execute(dto);

        revalidatePath('/products');

        return {
            ...Result.success(LotUnitPurchaseMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerLotUniPurchaseAction: ', error);
        return {
            ...handleError(error, 'registerLotUniPurchaseAction')
        }
    }
}