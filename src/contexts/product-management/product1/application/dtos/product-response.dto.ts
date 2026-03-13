/**
 * DTO de respuesta para Producto
 * Se utiliza para serializar la entidad de dominio en respuestas HTTP
 */
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
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;

  // Las relaciones se pueden agregar después
  // season?: SeasonResponseDto | null;
  // brand?: BrandResponseDto | null;
  // category?: CategoryResponseDto | null;
  // lots?: LotResponseDto[] | null;
  // inventory?: InventoryResponseDto | null;
}
