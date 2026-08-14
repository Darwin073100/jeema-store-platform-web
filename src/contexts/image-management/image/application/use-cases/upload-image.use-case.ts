import { ImageRepository } from '../../domain/repositories/image.repository';
import { ImageOwnerGatewayPort } from '../../domain/ports/out/image-owner-gateway.port';
import { ImageStoragePort } from 'src/shared/domain/ports/image-storage.port';
import { ImageProcessorPort } from 'src/shared/domain/ports/image-processor.port';
import { ImageEntity } from '../../domain/entities/image.entity';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { ImageLimitExceededException } from '../../domain/exceptions/image-limit-exceeded.exception';
import { InvalidImageOwnerException } from '../../domain/exceptions/invalid-image-owner.exception';
import { InvalidImageFileException } from '../../domain/exceptions/invalid-image-file.exception';
import {
  detectImageMimeTypeFromBuffer,
  getMaxRawUploadSizeBytes,
  getCompressionThresholdBytes,
  getMaxProcessedImageSizeBytes,
} from '../services/image-content-validator';

/** Máximo de imágenes activas por dueño — regla de negocio, no de UI. */
const MAX_ACTIVE_IMAGES_PER_OWNER = 3;

/**
 * UploadImageUseCase es genérico: no conoce si el dueño es un producto, un
 * empleado o un establecimiento — sólo conoce los puertos (`ImageRepository`,
 * `ImageStoragePort`, `ImageProcessorPort`) y el `ImageOwnerGatewayPort` ya
 * resuelto para el `ownerType` de la operación en curso.
 *
 * Orquesta, en orden (spect/01_gestion_imagenes_spect.md, sección 4):
 * validar dueño → validar tipo/tamaño crudo → límite de colección → comprimir
 * si supera el umbral → validar cota post-proceso → `ImageStoragePort` →
 * persistir → sincronizar el campo denormalizado del dueño si es principal.
 */
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageStorage: ImageStoragePort,
    private readonly imageOwnerGateway: ImageOwnerGatewayPort,
    private readonly imageProcessor: ImageProcessorPort,
  ) {}

  public async execute(command: UploadImageDto): Promise<ImageEntity> {
    const ownerExists = await this.imageOwnerGateway.exists(command.ownerId);
    if (!ownerExists) {
      throw new InvalidImageOwnerException(
        `No existe un dueño de tipo '${command.ownerType}' con id '${command.ownerId}'.`,
      );
    }

    // Validación de tipo de archivo por contenido real, no por extensión ni
    // por el Content-Type declarado por el cliente.
    const detectedMimeType = detectImageMimeTypeFromBuffer(command.buffer);
    if (!detectedMimeType) {
      throw new InvalidImageFileException(
        'El archivo no es una imagen válida. Formatos permitidos: JPEG, PNG, WEBP.',
      );
    }

    // Límite duro anti-abuso sobre el crudo, aplicado ANTES de procesar.
    const maxRawBytes = getMaxRawUploadSizeBytes();
    if (command.sizeBytes > maxRawBytes) {
      throw new InvalidImageFileException(
        `La imagen excede el tamaño máximo de subida de ${Math.round(maxRawBytes / (1024 * 1024))}MB.`,
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

    // Comportamiento tipo WhatsApp/Facebook: sólo se comprime/redimensiona si
    // el crudo supera el umbral configurado; un archivo ya liviano se guarda
    // tal cual, sin gastar CPU ni perder calidad re-codificándolo.
    let finalBuffer = command.buffer;
    let finalMimeType: string = detectedMimeType;
    let finalSizeBytes = command.sizeBytes;

    const compressionThresholdBytes = getCompressionThresholdBytes();
    if (command.sizeBytes > compressionThresholdBytes) {
      try {
        const processed = await this.imageProcessor.process({
          buffer: command.buffer,
          mimeType: detectedMimeType,
        });
        finalBuffer = processed.buffer;
        finalMimeType = processed.mimeType;
        finalSizeBytes = processed.sizeBytes;
      } catch {
        // El adaptador (shared/infrastructure) no conoce las excepciones de
        // dominio de este bounded context; aquí se traduce su error genérico.
        throw new InvalidImageFileException(
          'No fue posible procesar la imagen: el archivo podría estar corrupto o dañado.',
        );
      }
    }

    // Red de seguridad: si aun tras comprimir (o sin necesitarlo) el archivo
    // sigue siendo demasiado pesado, se rechaza sin llegar a ImageStoragePort.
    const maxProcessedBytes = getMaxProcessedImageSizeBytes();
    if (finalSizeBytes > maxProcessedBytes) {
      throw new InvalidImageFileException(
        `La imagen sigue superando ${Math.round(maxProcessedBytes / (1024 * 1024))}MB después de procesarla.`,
      );
    }

    const uploadResult = await this.imageStorage.upload({
      buffer: finalBuffer,
      originalFileName: command.originalFileName,
      mimeType: finalMimeType,
      ownerType: command.ownerType,
      ownerId: command.ownerId.toString(),
    });

    const image = ImageEntity.create(
      command.ownerType,
      command.ownerId,
      uploadResult.storageKey,
      uploadResult.url,
      finalMimeType,
      finalSizeBytes,
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
