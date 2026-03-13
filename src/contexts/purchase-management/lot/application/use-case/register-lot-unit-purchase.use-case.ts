import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { LotNotFoundException } from "../../domain/exceptions/lot-not-found.exception";
import { LotCheckerPort } from "../../domain/ports/out/lot-checker.port";
import { LotUnitPurchaseRepository } from "../../domain/repositories/lot-unit-purchase.repository";
import { LotPurchaseQuantityVO } from "../../domain/value-objects/lot-purchase-quantity.vo";
import { LotUnitsInPurchaseUnitVO } from "../../domain/value-objects/lot-units-in-purchase-unit.vo";
import { PurchasePriceVO } from "../../domain/value-objects/purchase-price.vo";
import { RegisterLotUnitPurchaseDTO } from "../dtos/register-lot-unit-purchase.dto";

export class RegisterLotUnitPurchaseUseCase{
    constructor(
        private readonly lotUnitPurchaseRepository: LotUnitPurchaseRepository,
        private readonly lotCheckerPort: LotCheckerPort,
    ){}

    async execute(dto: RegisterLotUnitPurchaseDTO){

        // Si no viene el id del lote se lanza un error
        if(!dto.lotId) throw new LotNotFoundException('El lote especificado no se encontró.');

        // Verificar que el lote exista, al que se le va a registrar la unidad de compra
        const isLot = await this.lotCheckerPort.exists(dto.lotId)

        // Lnaza un error si no se encontro el lote
        if(!isLot){
            throw new LotNotFoundException('El lote especificado no se encontró.');
        }
        
        const entity = LotUnitPurchaseEntity.create(
            dto.lotId,
            PurchasePriceVO.create(dto.purchasePrice),
            LotPurchaseQuantityVO.create(dto.purchaseQuantity),
            dto.unit,
            LotUnitsInPurchaseUnitVO.create(dto.unitsInPurchaseUnit),
        )
        const result = await this.lotUnitPurchaseRepository.save(entity)
        return result
    }
}