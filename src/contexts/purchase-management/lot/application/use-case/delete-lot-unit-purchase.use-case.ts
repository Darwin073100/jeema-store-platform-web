import { LotNotFoundException } from "../../domain/exceptions/lot-not-found.exception";
import { LotUnitPurchaseRepository } from "../../domain/repositories/lot-unit-purchase.repository";
import { LotRepository } from "../../domain/repositories/lot.repository";

export class DeleteLotUnitPurchaseUseCase{
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly repository: LotUnitPurchaseRepository
    ){}

    async execute(lotId: bigint, lotUnitPurchaseId: bigint){
        const lotExist = await this.lotRepository.existById(lotId);

        if( !lotExist ){
            throw new LotNotFoundException('El lote espefificado no existe.');
        }

        return this.repository.delete(lotUnitPurchaseId);
    }
}