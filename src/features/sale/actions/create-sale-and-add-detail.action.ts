'use server';
import { AddDetailToSaleDto } from "../application/dtos/add-detail-to-sale.dto";
import { RegisterSaleDto } from "../application/dtos/register-sale.dto";
import { CreateSaleAndAddDetailUseCase } from "../application/use-case/create-sale-and-add-detail.use-case";
import { SaleRepositoryFactory } from "../infraestructure/factory/sale-repository.factory";

export async function CreateSaleAndAddDetailAction(saleId: bigint, saveSaleDTO: RegisterSaleDto, addDetailDTO: AddDetailToSaleDto){
    const repository = SaleRepositoryFactory.create();
    const useCase = new CreateSaleAndAddDetailUseCase(repository);

    const result = await useCase.execute(saleId, saveSaleDTO, addDetailDTO);
    
    return {
        ...result
    }
}