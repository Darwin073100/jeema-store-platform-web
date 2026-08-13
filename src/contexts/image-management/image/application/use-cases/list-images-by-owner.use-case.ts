import { ImageRepository } from '../../domain/repositories/image.repository';
import { ImageEntity } from '../../domain/entities/image.entity';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';

export class ListImagesByOwnerUseCase {
  constructor(private readonly imageRepository: ImageRepository) {}

  public async execute(ownerType: ImageOwnerType, ownerId: bigint): Promise<ImageEntity[]> {
    return this.imageRepository.findActiveByOwner(ownerType, ownerId);
  }
}
