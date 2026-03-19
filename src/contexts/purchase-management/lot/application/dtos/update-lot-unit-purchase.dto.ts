import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export interface UpdateLotUnitPurchaseDTO{
    lotUnitPurchaseId: bigint;
    lotId: bigint;
    purchasePrice: number;
    purchaseQuantity: number;
    unit: ForSaleEnum;
    unitsInPurchaseUnit: number;
}