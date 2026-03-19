import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export interface UpdateLotDto {
  lotId: bigint;
  productId: bigint;
  suplierId: bigint | null;
  lotNumber: string;
  purchasePrice: number;
  initialQuantity: number;
  purchaseUnit: ForSaleEnum;
  expirationDate: Date | null;
  manufacturingDate: Date | null;
  receivedDate: Date;
}
