import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";

export class ViewAllSaleUseCase{
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute():Promise<SaleEntity[]>{
        const result = await this.repository.findAll();
        return result;
    }
}