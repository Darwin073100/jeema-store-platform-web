import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";

export interface ILotUnitPurchase{
    lotUnitPurchaseId: bigint
    lotId: bigint;
    purchasePrice: number;
    purchaseQuantity: number;
    unit: ForSaleEnum;
    unitsInPurchaseUnit: number;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}