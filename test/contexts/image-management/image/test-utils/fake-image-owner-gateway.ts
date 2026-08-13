import { ImageOwnerGatewayPort } from '@/contexts/image-management/image/domain/ports/out/image-owner-gateway.port';

/**
 * Fake en memoria de `ImageOwnerGatewayPort`, inyectado manualmente en los
 * tests de use-cases para no depender de los repositorios reales de
 * producto/empleado/establecimiento.
 */
export class FakeImageOwnerGateway implements ImageOwnerGatewayPort {
  public primaryImageUrlUpdates: Array<{ ownerId: bigint; url: string | null }> = [];

  constructor(private readonly existingOwnerIds: Set<string> = new Set()) {}

  static withExistingOwner(ownerId: bigint): FakeImageOwnerGateway {
    return new FakeImageOwnerGateway(new Set([ownerId.toString()]));
  }

  async exists(ownerId: bigint): Promise<boolean> {
    return this.existingOwnerIds.has(ownerId.toString());
  }

  async updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void> {
    this.primaryImageUrlUpdates.push({ ownerId, url });
  }
}
