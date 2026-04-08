'use server';
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { FindByIdSaleUseCase } from "../../application/use-cases/find-by-id-sale.use-case";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { Result } from "@/shared/lib/utils/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";

export async function findSaleWithDetailAction(saleId: bigint) {
    try {
        const repository = await TypeormSaleRepository.create();
        const useCase = new FindByIdSaleUseCase(repository);

        const result = await useCase.execute(saleId);

        return {
            ...Result.success(SaleMapper.toIResponse(result))
        }
    }catch(error){
        return {
            ...handleError(error, 'findSaleWithDetailAction')
        }
    }
}