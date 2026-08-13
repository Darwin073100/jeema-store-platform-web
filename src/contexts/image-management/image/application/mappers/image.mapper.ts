import { ImageEntity } from '../../domain/entities/image.entity';
import { ImageResponseDto } from '../dtos/image-response.dto';
import { IImage } from '../../presentation/interfaces/IImage';

export class ImageMapper {
  static toResponseDto(entity: ImageEntity): ImageResponseDto {
    return new ImageResponseDto(
      entity.imageId.toString(),
      entity.ownerType,
      entity.ownerId.toString(),
      entity.url,
      entity.mimeType,
      entity.sizeBytes,
      entity.isPrimary,
      entity.sortOrder,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toIResponse(entity: ImageEntity): IImage {
    return {
      imageId: entity.imageId,
      ownerType: entity.ownerType,
      ownerId: entity.ownerId,
      url: entity.url,
      mimeType: entity.mimeType,
      sizeBytes: entity.sizeBytes,
      isPrimary: entity.isPrimary,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
