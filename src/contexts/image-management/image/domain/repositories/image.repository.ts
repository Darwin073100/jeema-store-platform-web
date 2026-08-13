import { ImageOwnerType } from '../enums/image-owner-type.enum';
import { ImageEntity } from '../entities/image.entity';

export const IMAGE_REPOSITORY = Symbol('IMAGE_REPOSITORY');

/**
 * ImageRepository es el puerto de salida (interfaz de dominio) para la
 * persistencia de `ImageEntity`. No extiende `TemplateRepository` porque las
 * consultas de este contexto siempre están acotadas a un dueño
 * (`ownerType` + `ownerId`), no a "todas las imágenes".
 */
export interface ImageRepository {
  save(image: ImageEntity): Promise<ImageEntity>;

  findById(imageId: bigint): Promise<ImageEntity | null>;

  /** Imágenes activas (no borradas) de un dueño, ordenadas por `sortOrder`. */
  findActiveByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<ImageEntity[]>;

  /** Cuenta de imágenes activas de un dueño, usada para la regla de máximo 3. */
  countActiveByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<number>;

  findPrimaryByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<ImageEntity | null>;

  /** Soft delete (`deleted_at`), consistente con el resto del esquema. */
  softDelete(imageId: bigint): Promise<void>;
}
