'use server';

import { Result } from "@/shared/lib/utils/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";
import { FindFinishSaleByIdUseCase } from "../../application/use-cases/find-finish-sale-by-id.use-case";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function findSaleInfoByIdAction(saleId: bigint) {
    try {
        const repository = await TypeormSaleRepository.create();
        const useCase = new FindFinishSaleByIdUseCase(repository);

        const result = await useCase.execute(saleId);

        return {
            ...Result.success(SaleMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'findSaleInfoByIdAction')
        }
    }
}