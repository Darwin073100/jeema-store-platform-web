import { ProductEntity } from "../../../product/domain/entities/product.entity";
import { ForSaleEnum } from "@/features/product/domain/enums/for-sale.enum";
import { LotUnitPurchaseEntity } from "./lot-unit-purchase.entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";

export interface LotEntity {
  lotId              : bigint;
  productId          : bigint;
  lotNumber          : string;
  purchasePrice      : number;
  initialQuantity    : number;
  purchaseUnit       : ForSaleEnum;
  expirationDate?    : Date | null;
  manufacturingDate? : Date | null;
  product?           : ProductEntity | null;
  receivedDate       : Date;
  inventories        : InventoryEntity[];
  lotUnitPurchases?  : LotUnitPurchaseEntity[]|null,
  createdAt          : Date;
  updatedAt?         : Date | null;
  deletedAt?         : Date | null;
}