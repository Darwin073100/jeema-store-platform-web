import { ImageRepository } from '../../domain/repositories/image.repository';
import { ImageOwnerGatewayPort } from '../../domain/ports/out/image-owner-gateway.port';
import { ImageEntity } from '../../domain/entities/image.entity';
import { ImageNotFoundException } from '../../domain/exceptions/image-not-found.exception';

export class SetPrimaryImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageOwnerGateway: ImageOwnerGatewayPort,
  ) {}

  public async execute(imageId: bigint): Promise<ImageEntity> {
    const image = await this.imageRepository.findById(imageId);
    if (!image || image.deletedAt) {
      throw new ImageNotFoundException('La imagen que intentas marcar como principal no existe.');
    }

    if (image.isPrimary) {
      return image;
    }

    // Se desmarca primero la principal anterior (si existe) para nunca tener,
    // ni siquiera momentáneamente, dos imágenes principales activas para el
    // mismo dueño (reforzado también por el índice único parcial en BD).
    const previousPrimary = await this.imageRepository.findPrimaryByOwner(image.ownerType, image.ownerId);
    if (previousPrimary && previousPrimary.imageId !== image.imageId) {
      previousPrimary.unmarkAsPrimary();
      await this.imageRepository.save(previousPrimary);
    }

    image.markAsPrimary();
    const savedImage = await this.imageRepository.save(image);

    await this.imageOwnerGateway.updatePrimaryImageUrl(image.ownerId, savedImage.url);

    return savedImage;
  }
}
