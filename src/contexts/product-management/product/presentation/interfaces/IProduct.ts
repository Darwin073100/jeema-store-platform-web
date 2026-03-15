import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { IInventory } from "src/contexts/inventory-management/inventory/presentation/interfaces/IInventory";
import { IBrand } from "src/contexts/product-management/brand/presentation/interfaces/Ibrand";
import { ICategory } from "src/contexts/product-management/category/presentation/interfaces/ICategory";
import { ISeason } from "src/contexts/product-management/season/presentation/interfaces/ISeason";
import { ILot } from "src/contexts/purchase-management/lot/presentation/interfaces/ILot";

export interface IProduct {
  productId: bigint;
  establishmentId: bigint;
  categoryId: bigint;
  brandId: bigint | null;
  seasonId: bigint | null;
  name: string;
  sku: string | null;
  universalBarCode: string | null;
  description: string | null;
  unitOfMeasure: string;
  minStockGlobal: number;
  imageUrl: string | null;
  season: ISeason | null;
  brand: IBrand | null;
  category: ICategory | null;
  lots: ILot[] | null;
  inventory: IInventory | null;
  establishment: IEstablishment | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}