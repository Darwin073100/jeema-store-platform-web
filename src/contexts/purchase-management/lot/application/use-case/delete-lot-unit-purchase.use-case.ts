import { LotNotFoundException } from "../../domain/exceptions/lot-not-found.exception";
import { LotCheckerPort } from "../../domain/ports/out/lot-checker.port";
import { LotUnitPurchaseRepository } from "../../domain/repositories/lot-unit-purchase.repository";

export class DeleteLotUnitPurchaseUseCase{
    constructor(
        private readonly lotCheckerPort: LotCheckerPort,
        private readonly repository: LotUnitPurchaseRepository
    ){}

    async execute(lotId: bigint, lotUnitPurchaseId: bigint){
        const lotExist = await this.lotCheckerPort.exists(lotId);

        if( !lotExist ){
            throw new LotNotFoundException('El lote espefificado no existe.');
        }

        return this.repository.delete(lotUnitPurchaseId);
    }
}