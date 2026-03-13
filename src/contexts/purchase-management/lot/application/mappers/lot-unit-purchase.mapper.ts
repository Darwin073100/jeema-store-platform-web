import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
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
}