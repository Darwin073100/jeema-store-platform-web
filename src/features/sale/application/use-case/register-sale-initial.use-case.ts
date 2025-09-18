import { SaleRepository } from "../../domain/repositories/sale.repository";
import { RegisterSaleDto } from "../dtos/register-sale.dto";

export class RegisterSaleInitialUseCase {
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(dto: RegisterSaleDto){
        const result = await this.repository.save(dto);
        return result;
    }
}