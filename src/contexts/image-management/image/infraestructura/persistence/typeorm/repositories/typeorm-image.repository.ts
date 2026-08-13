import { DataSource, Repository } from 'typeorm';
import { ImageOrmEntity } from '../entities/image.orm-entity';
import { ImageMapper } from '../mappers/image.mapper';
import { ImageRepository } from 'src/contexts/image-management/image/domain/repositories/image.repository';
import { ImageEntity } from 'src/contexts/image-management/image/domain/entities/image.entity';
import { ImageOwnerType } from 'src/contexts/image-management/image/domain/enums/image-owner-type.enum';
import { getDataSource } from '@/configuration/databases/typeorm/config';

export class TypeOrmImageRepository implements ImageRepository {
  private readonly imageRepository: Repository<ImageOrmEntity>;

  constructor(private readonly datasource: DataSource) {
    this.imageRepository = this.datasource.getRepository(ImageOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmImageRepository.create();
   */
  static async create(): Promise<TypeOrmImageRepository> {
    const dataSource = await getDataSource();
    return new TypeOrmImageRepository(dataSource);
  }

  async save(image: ImageEntity): Promise<ImageEntity> {
    const existing = image.imageId !== BigInt(0) ? await this.imageRepository.findOneBy({ imageId: image.imageId }) : null;

    if (existing) {
      existing.url = image.url;
      existing.isPrimary = image.isPrimary;
      existing.sortOrder = image.sortOrder;
      existing.updatedAt = image.updatedAt;
      existing.deletedAt = image.deletedAt;
      const result = await this.imageRepository.save(existing);
      return ImageMapper.toDomain(result);
    }

    const ormEntity = ImageMapper.toOrm(image);
    const result = await this.imageRepository.save(ormEntity);
    return ImageMapper.toDomain(result);
  }

  async findById(imageId: bigint): Promise<ImageEntity | null> {
    const result = await this.imageRepository.findOneBy({ imageId });
    return result ? ImageMapper.toDomain(result) : null;
  }

  async findActiveByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<ImageEntity[]> {
    const result = await this.imageRepository.find({
      where: { ownerType, ownerId },
      order: { sortOrder: 'ASC' },
    });
    return result.map((orm) => ImageMapper.toDomain(orm));
  }

  async countActiveByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<number> {
    return this.imageRepository.count({ where: { ownerType, ownerId } });
  }

  async findPrimaryByOwner(ownerType: ImageOwnerType, ownerId: bigint): Promise<ImageEntity | null> {
    const result = await this.imageRepository.findOne({
      where: { ownerType, ownerId, isPrimary: true },
    });
    return result ? ImageMapper.toDomain(result) : null;
  }

  async softDelete(imageId: bigint): Promise<void> {
    await this.imageRepository.softDelete({ imageId });
  }
}
