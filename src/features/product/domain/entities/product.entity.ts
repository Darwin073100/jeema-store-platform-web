import { SeasonEntity } from "@/features/season/domain/entities/season.entity";
import { CategoryEntity } from "../../../category/domain/entities/category.entity";
import { BrandEntity } from "@/features/brand/domain/entities/brand.entity";
import { LotEntity } from "../../../lot/domain/entities/lot.entity";
import { InventoryEntity } from "@/features/inventory/domain/entities/inventory.entity";

export interface ProductEntity {
  productId        : bigint;
  establishmentId  : bigint;
  categoryId       : bigint;
  brandId          : bigint | null;
  seasonId         : bigint | null;
  name             : string;
  sku              : string | null;
  universalBarCode : string | null;
  description      : string | null;
  unitOfMeasure    : string;
  minStockGlobal   : number;
  imageUrl         : string | null;
  season?          : SeasonEntity | null;
  brand?           : BrandEntity | null;
  category?        : CategoryEntity | null;
  lots?            : LotEntity[] | null;
  inventories?     : InventoryEntity |null;
  createdAt        : Date;
  updatedAt        : Date | null;
  deletedAt        : Date | null;
}