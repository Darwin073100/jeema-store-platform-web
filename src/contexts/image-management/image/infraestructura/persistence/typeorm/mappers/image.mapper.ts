import { ImageOrmEntity } from '../entities/image.orm-entity';
import { ImageEntity } from 'src/contexts/image-management/image/domain/entities/image.entity';

export class ImageMapper {
  static toDomain(entity: ImageOrmEntity): ImageEntity {
    return ImageEntity.reconstitute(
      BigInt(entity.imageId),
      entity.ownerType,
      BigInt(entity.ownerId),
      entity.storageKey,
      entity.url,
      entity.mimeType,
      Number(entity.sizeBytes),
      entity.isPrimary,
      entity.sortOrder,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toOrm(entity: ImageEntity): ImageOrmEntity {
    const orm = new ImageOrmEntity();
    orm.imageId = entity.imageId;
    orm.ownerType = entity.ownerType;
    orm.ownerId = entity.ownerId;
    orm.storageKey = entity.storageKey;
    orm.url = entity.url;
    orm.mimeType = entity.mimeType;
    orm.sizeBytes = entity.sizeBytes;
    orm.isPrimary = entity.isPrimary;
    orm.sortOrder = entity.sortOrder;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt;
    return orm;
  }
}
