import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";

export interface AddLotUnitPurchaseDTO{
      lotId: bigint;
      purchasePrice: number;
      purchaseQuantity: number;
      unit: ForSaleEnum;
      unitsInPurchaseUnit: number;
}