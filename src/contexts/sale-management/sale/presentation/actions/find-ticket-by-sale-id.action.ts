'use server';
import { unstable_noStore } from "next/cache";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { FindSaleTicketByIdUseCase } from "../../application/use-cases/find-sale-ticket-by-id.use-case";
import { Result } from "@/shared/features/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

unstable_noStore();

export async function findTicketBySaleIdAction(saleId: bigint){
    try{
        const repository = await TypeormSaleRepository.create();
    const useCase = new FindSaleTicketByIdUseCase(repository);

    const result = await useCase.execute(saleId);
    
    return {
        ...Result.success(SaleMapper.toIResponse(result))
    };
    }catch(error){
        return {
            ...handleError(error, 'findTicketBySaleIdAction')
        }
    }
}