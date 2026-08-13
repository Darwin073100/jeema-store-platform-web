import { ImageRepository } from '../../domain/repositories/image.repository';
import { ImageOwnerGatewayPort } from '../../domain/ports/out/image-owner-gateway.port';
import { ImageStoragePort } from 'src/shared/domain/ports/image-storage.port';
import { ImageEntity } from '../../domain/entities/image.entity';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { ImageLimitExceededException } from '../../domain/exceptions/image-limit-exceeded.exception';
import { InvalidImageOwnerException } from '../../domain/exceptions/invalid-image-owner.exception';
import { InvalidImageFileException } from '../../domain/exceptions/invalid-image-file.exception';
import { detectImageMimeTypeFromBuffer, getMaxImageSizeBytes } from '../services/image-content-validator';

/** Máximo de imágenes activas por dueño — regla de negocio, no de UI. */
const MAX_ACTIVE_IMAGES_PER_OWNER = 3;

/**
 * UploadImageUseCase es genérico: no conoce si el dueño es un producto, un
 * empleado o un establecimiento — sólo conoce los dos puertos
 * (`ImageRepository`, `ImageStoragePort`) y el `ImageOwnerGatewayPort` ya
 * resuelto para el `ownerType` de la operación en curso.
 */
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageStorage: ImageStoragePort,
    private readonly imageOwnerGateway: ImageOwnerGatewayPort,
  ) {}

  public async execute(command: UploadImageDto): Promise<ImageEntity> {
    // Validación de tipo de archivo por contenido real, no por extensión ni
    // por el Content-Type declarado por el cliente.
    const detectedMimeType = detectImageMimeTypeFromBuffer(command.buffer);
    if (!detectedMimeType) {
      throw new InvalidImageFileException(
        'El archivo no es una imagen válida. Formatos permitidos: JPEG, PNG, WEBP.',
      );
    }

    const maxSizeBytes = getMaxImageSizeBytes();
    if (command.sizeBytes > maxSizeBytes) {
      throw new InvalidImageFileException(
        `La imagen excede el tamaño máximo permitido de ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`,
      );
    }

    const ownerExists = await this.imageOwnerGateway.exists(command.ownerId);
    if (!ownerExists) {
      throw new InvalidImageOwnerException(
        `No existe un dueño de tipo '${command.ownerType}' con id '${command.ownerId}'.`,
      );
    }

    const activeCount = await this.imageRepository.countActiveByOwner(command.ownerType, command.ownerId);
    if (activeCount >= MAX_ACTIVE_IMAGES_PER_OWNER) {
      throw new ImageLimitExceededException(
        `El dueño ya tiene el máximo de ${MAX_ACTIVE_IMAGES_PER_OWNER} imágenes activas.`,
      );
    }

    // La primera imagen de un dueño se marca automáticamente como principal.
    const isPrimary = activeCount === 0;
    const sortOrder = activeCount + 1;

    const uploadResult = await this.imageStorage.upload({
      buffer: command.buffer,
      originalFileName: command.originalFileName,
      mimeType: detectedMimeType,
      ownerType: command.ownerType,
      ownerId: command.ownerId.toString(),
    });

    const image = ImageEntity.create(
      command.ownerType,
      command.ownerId,
      uploadResult.storageKey,
      uploadResult.url,
      detectedMimeType,
      command.sizeBytes,
      isPrimary,
      sortOrder,
    );

    let savedImage: ImageEntity;
    try {
      savedImage = await this.imageRepository.save(image);
    } catch (error) {
      // Si no se pudo persistir el registro, no dejamos un archivo huérfano en el storage.
      await this.imageStorage.delete(uploadResult.storageKey);
      throw error;
    }

    if (isPrimary) {
      await this.imageOwnerGateway.updatePrimaryImageUrl(command.ownerId, uploadResult.url);
    }

    return savedImage;
  }
}
