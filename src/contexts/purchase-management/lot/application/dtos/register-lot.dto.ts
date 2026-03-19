import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { RegisterLotUnitPurchaseDTO } from "./register-lot-unit-purchase.dto";

export interface RegisterLotDto {
  productId: bigint;
  lotNumber: string;
  suplierId: bigint | null;
  purchasePrice: number;
  initialQuantity: number;
  purchaseUnit: ForSaleEnum;
  expirationDate: Date | null;
  manufacturingDate: Date | null;
  receivedDate: Date;
  lotUnitPurchases: RegisterLotUnitPurchaseDTO[] | null;
}
