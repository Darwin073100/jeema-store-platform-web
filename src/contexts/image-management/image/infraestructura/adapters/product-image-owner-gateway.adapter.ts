import { ImageOwnerGatewayPort } from 'src/contexts/image-management/image/domain/ports/out/image-owner-gateway.port';
import { ProductRepository } from 'src/contexts/product-management/product/domain/repositories/product.repository';

/**
 * Adaptador de `ImageOwnerGatewayPort` para dueños de tipo PRODUCT.
 * Reutiliza directamente `ProductRepository`, sin ningún checker port nuevo.
 */
export class ProductImageOwnerGatewayAdapter implements ImageOwnerGatewayPort {
  constructor(private readonly productRepository: ProductRepository) {}

  async exists(ownerId: bigint): Promise<boolean> {
    const product = await this.productRepository.existById(ownerId);
    return product !== null;
  }

  async updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void> {
    const product = await this.productRepository.findById(ownerId);
    if (!product) return;
    product.updateImageUrl(url);
    await this.productRepository.save(product);
  }
}
