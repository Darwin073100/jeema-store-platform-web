import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { ILotUnitPurchase } from "../../presentation/interfaces/ILotUnitPurchase";
import { LotUnitPurchaseResponseDTO } from "../dtos/lot-unit-purchase-response.dto";

export class LotUnitPurchaseMapper{
    static toResponseDTO(domainEntity: LotUnitPurchaseEntity): LotUnitPurchaseResponseDTO {
        const dto = new LotUnitPurchaseResponseDTO();
        dto.lotUnitPurchaseId = domainEntity.lotUnitPurchaseId.toString();
        dto.lotId = (domainEntity.lotId ?? BigInt(0)).toString();
        dto.purchasePrice = domainEntity.purchasePrice.value;
        dto.purchaseQuantity = domainEntity.purchaseQuantity.value;
        dto.unit = domainEntity.unit;
        dto.unitsInPurchaseUnit = domainEntity.unitsInPurchaseUnit.value;
        dto.createdAt = domainEntity.createdAt;
        dto.updatedAt = domainEntity.updatedAt;
        dto.deletedAt = domainEntity.deletedAt;
        return dto;
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