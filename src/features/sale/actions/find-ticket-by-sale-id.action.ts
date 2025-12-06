'use server';
import { unstable_noStore } from "next/cache";
import { FindTicketBySaleIdUseCase } from "../application/use-case/find-ticket-by-sale-id.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

unstable_noStore();

export async function findTicketBySaleIdAction(saleId: bigint){
    const repository = SaleRepositoryFactory.create();
    const useCase = new FindTicketBySaleIdUseCase(repository);

    const result = await useCase.execute(saleId);
    
    return {
        ...result
    };
}