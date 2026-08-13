import { ImageRepository } from '../../domain/repositories/image.repository';
import { ImageOwnerGatewayPort } from '../../domain/ports/out/image-owner-gateway.port';
import { ImageStoragePort } from 'src/shared/domain/ports/image-storage.port';
import { ImageNotFoundException } from '../../domain/exceptions/image-not-found.exception';

export class DeleteImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageStorage: ImageStoragePort,
    private readonly imageOwnerGateway: ImageOwnerGatewayPort,
  ) {}

  public async execute(imageId: bigint): Promise<void> {
    const image = await this.imageRepository.findById(imageId);
    if (!image || image.deletedAt) {
      throw new ImageNotFoundException('La imagen que intentas eliminar no existe.');
    }

    await this.imageStorage.delete(image.storageKey);
    await this.imageRepository.softDelete(imageId);

    if (!image.isPrimary) {
      return;
    }

    // Al eliminar la imagen principal: se promueve la de menor sortOrder si
    // quedan otras activas, o se limpia el campo denormalizado del dueño.
    const remaining = await this.imageRepository.findActiveByOwner(image.ownerType, image.ownerId);
    if (remaining.length === 0) {
      await this.imageOwnerGateway.updatePrimaryImageUrl(image.ownerId, null);
      return;
    }

    const [nextPrimary] = remaining;
    nextPrimary.markAsPrimary();
    const savedNextPrimary = await this.imageRepository.save(nextPrimary);
    await this.imageOwnerGateway.updatePrimaryImageUrl(image.ownerId, savedNextPrimary.url);
  }
}
