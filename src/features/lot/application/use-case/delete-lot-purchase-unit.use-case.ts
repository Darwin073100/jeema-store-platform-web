import { LotRepository } from "../../domain/repositories/lot.repository";

export class DeleteLotUnitPurchaseUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(lotId: bigint, lotUnitPurchaseId: bigint){
        const result = await this.repository.deleteLotUnitPurchase(lotId, lotUnitPurchaseId);
        return result; 
    }
}