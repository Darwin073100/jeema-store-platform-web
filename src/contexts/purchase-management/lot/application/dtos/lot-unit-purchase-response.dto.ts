import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export interface LotUnitPurchaseResponseDTO{
    lotUnitPurchaseId: string
    lotId: string;
    purchasePrice: number;
    purchaseQuantity: number;
    unit: ForSaleEnum;
    unitsInPurchaseUnit: number;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}