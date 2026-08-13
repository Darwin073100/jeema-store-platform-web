import { ImageOwnerGatewayPort } from 'src/contexts/image-management/image/domain/ports/out/image-owner-gateway.port';
import { EstablishmentRepository } from 'src/contexts/establishment-management/establishment/domain/repositories/establishment.repository';

/**
 * Adaptador de `ImageOwnerGatewayPort` para dueños de tipo ESTABLISHMENT.
 * Reutiliza directamente `EstablishmentRepository`, sin ningún checker port nuevo.
 */
export class EstablishmentImageOwnerGatewayAdapter implements ImageOwnerGatewayPort {
  constructor(private readonly establishmentRepository: EstablishmentRepository) {}

  async exists(ownerId: bigint): Promise<boolean> {
    const establishment = await this.establishmentRepository.existById(ownerId);
    return establishment !== null;
  }

  async updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void> {
    const establishment = await this.establishmentRepository.findById(ownerId);
    if (!establishment) return;
    establishment.updateLogoUrl(url);
    await this.establishmentRepository.transactionUpdate(establishment);
  }
}
