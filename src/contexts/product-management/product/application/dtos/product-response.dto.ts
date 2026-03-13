import { InventoryResponseDto } from "src/contexts/inventory-management/inventory/application/dtos/inventory-response.dto";
import { BrandResponseDto } from "src/contexts/product-management/brand/application/dtos/brand-response.dto";
import { CategoryResponseDto } from "src/contexts/product-management/category/application/dtos/category-response.dto";
import { SeasonResponseDto } from "src/contexts/product-management/season/application/dtos/season-response.dto";
import { LotResponseDto } from "src/contexts/purchase-management/lot/application/dtos/lot-response.dto";

export class ProductResponseDto {
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
  season?: SeasonResponseDto | null;
  brand?: BrandResponseDto | null;
  category?: CategoryResponseDto | null;
  lots?: LotResponseDto[] | null;
  inventory?: InventoryResponseDto|null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
