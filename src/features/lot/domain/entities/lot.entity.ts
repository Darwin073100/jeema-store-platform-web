import { ProductEntity } from "../../../product/domain/entities/product.entity";
import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";
import { LotUnitPurchaseEntity } from "./lot-unit-purchase.entity";
import { SuplierEntity } from "@/features/suplier/domain/entities/suplier.entity";

export interface LotEntity {
  lotId              : bigint;
  productId          : bigint;
  suplierId          : bigint | null;
  lotNumber          : string;
  purchasePrice      : number;
  initialQuantity    : number;
  purchaseUnit       : ForSaleEnum;
  expirationDate?    : Date | null;
  manufacturingDate? : Date | null;
  product?           : ProductEntity | null;
  receivedDate       : Date;
  lotUnitPurchases?  : LotUnitPurchaseEntity[]|null;
  suplier?           : SuplierEntity | null;
  createdAt          : Date;
  updatedAt?         : Date | null;
  deletedAt?         : Date | null;
}