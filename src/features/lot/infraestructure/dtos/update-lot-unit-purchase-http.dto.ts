import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";

export interface UpdateLotUnitPurchaseHttpDTO{
      lotUnitPurchaseId: string;
      lotId: string;
      purchasePrice: number;
      purchaseQuantity: number;
      unit: ForSaleEnum;
      unitsInPurchaseUnit: number;
}