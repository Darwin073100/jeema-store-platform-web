/**
 * DTO para actualizar un Producto existente
 * Contiene la información que viene del cliente para actualizar un producto
 */
export class UpdateProductDto {
  productId: bigint;
  name?: string;
  sku?: string | null;
  universalBarCode?: string | null;
  description?: string | null;
  unitOfMeasure?: string;
  minStockGlobal?: number;
  imageUrl?: string | null;
}
