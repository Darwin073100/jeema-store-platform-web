import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { LotNotFoundException } from "../../domain/exceptions/lot-not-found.exception";
import { LotUnitPurchaseRepository } from "../../domain/repositories/lot-unit-purchase.repository";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { LotPurchaseQuantityVO } from "../../domain/value-objects/lot-purchase-quantity.vo";
import { LotUnitsInPurchaseUnitVO } from "../../domain/value-objects/lot-units-in-purchase-unit.vo";
import { PurchasePriceVO } from "../../domain/value-objects/purchase-price.vo";
import { UpdateLotUnitPurchaseDTO } from "../dtos/update-lot-unit-purchase.dto";

export class UpdateLotUnitPurchaseUseCase{
    constructor(
        private readonly lotUnitPurchaseRepository: LotUnitPurchaseRepository,
        private readonly lotRepository: LotRepository,
    ){}

    async execute(dto: UpdateLotUnitPurchaseDTO){
        const isLot = await this.lotRepository.existById(dto.lotId)

        if(!isLot){
            throw new LotNotFoundException('El lote especificado no se encontró.');
        }
        
        const entity = LotUnitPurchaseEntity.reconstitute(
            dto.lotUnitPurchaseId,
            dto.lotId,
            PurchasePriceVO.create(dto.purchasePrice),
            LotPurchaseQuantityVO.create(dto.purchaseQuantity),
            dto.unit,
            LotUnitsInPurchaseUnitVO.create(dto.unitsInPurchaseUnit),
            new Date(),
            null,
            null,
            null
        )
        const result = await this.lotUnitPurchaseRepository.save(entity)
        return result
    }
}