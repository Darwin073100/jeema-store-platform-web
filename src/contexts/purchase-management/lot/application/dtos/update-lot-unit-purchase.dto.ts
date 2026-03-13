import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export class UpdateLotUnitPurchaseDTO{
    lotUnitPurchaseId: bigint;
    lotId: bigint;
    purchasePrice: number;
    purchaseQuantity: number;
    unit: ForSaleEnum;
    unitsInPurchaseUnit: number;
}