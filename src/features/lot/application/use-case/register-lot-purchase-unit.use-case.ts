import { LotRepository } from "../../domain/repositories/lot.repository";
import { AddLotUnitPurchaseDTO } from "../dtos/add-lot-unit-purchase.dto";

export class RegisterLotUnitPurchaseUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(dto: AddLotUnitPurchaseDTO){
        const result = await this.repository.addPurchaseUnit(dto);
        return result; 
    }
}