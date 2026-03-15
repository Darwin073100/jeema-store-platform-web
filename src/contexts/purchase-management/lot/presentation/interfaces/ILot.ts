import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { ForSaleEnum } from "@/shared/domain/enums/for-sale.enum";
import { ILotUnitPurchase } from "./ILotUnitPurchase";
import { ISuplier } from "@/contexts/purchase-management/suplier/presentation/interfaces/ISuplier";

export interface ILot {
  lotId: bigint;
  productId: bigint;
  suplierId: bigint | null;
  lotNumber: string;
  purchasePrice: number;
  initialQuantity: number;
  purchaseUnit: ForSaleEnum;
  expirationDate: Date | null;
  manufacturingDate: Date | null;
  product: IProduct | null;
  receivedDate: Date;
  lotUnitPurchases: ILotUnitPurchase[];
  suplier: ISuplier | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}