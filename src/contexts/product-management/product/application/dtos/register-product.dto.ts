export class RegisterProductDto {
  establishmentId: bigint;
  categoryId: bigint;
  brandId?: bigint | null;
  seasonId?: bigint | null;
  name: string;
  sku?: string | null;
  universalBarCode?: string | null;
  description?: string | null;
  unitOfMeasure: string;
  minStockGlobal: number;
  imageUrl?: string | null;
}
