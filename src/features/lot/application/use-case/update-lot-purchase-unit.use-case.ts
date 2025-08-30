import { LotRepository } from "../../domain/repositories/lot.repository";
import { UpdateLotUnitPurchaseDTO } from "../dtos/update-lot-unit-purchase.dto";

export class UpdateLotUnitPurchaseUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(dto: UpdateLotUnitPurchaseDTO){
        const result = await this.repository.updatePurchaseUnit(dto);
        return result; 
    }
}