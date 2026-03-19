import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export interface RegisterLotUnitPurchaseDTO{
    lotId?: bigint; // Opcional porque se establecerá automáticamente por la relación
    purchasePrice: number;
    purchaseQuantity: number;
    unit: ForSaleEnum;
    unitsInPurchaseUnit: number;
}