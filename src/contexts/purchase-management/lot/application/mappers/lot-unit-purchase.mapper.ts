import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { ILotUnitPurchase } from "../../presentation/interfaces/ILotUnitPurchase";
import { LotUnitPurchaseResponseDTO } from "../dtos/lot-unit-purchase-response.dto";

export class LotUnitPurchaseMapper{
    static toResponseDTO(domainEntity: LotUnitPurchaseEntity): LotUnitPurchaseResponseDTO {
        return {
            lotUnitPurchaseId: domainEntity.lotUnitPurchaseId.toString(),
            lotId: domainEntity.lotId.toString(),
            purchasePrice: domainEntity.purchasePrice.value,
            purchaseQuantity: domainEntity.purchaseQuantity.value,
            unit: domainEntity.unit,
            unitsInPurchaseUnit: domainEntity.unitsInPurchaseUnit.value,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt ?? null,
            deletedAt: domainEntity.deletedAt ?? null,
        }
    }
    static toIResponse(domainEntity: LotUnitPurchaseEntity): ILotUnitPurchase {
        return {
            lotUnitPurchaseId: domainEntity.lotUnitPurchaseId,
            lotId: domainEntity.lotId,
            purchasePrice: domainEntity.purchasePrice.value,
            purchaseQuantity: domainEntity.purchaseQuantity.value,
            unit: domainEntity.unit,
            unitsInPurchaseUnit: domainEntity.unitsInPurchaseUnit.value,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt ?? null,
            deletedAt: domainEntity.deletedAt ?? null,
        }
    }
}