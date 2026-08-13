import { DataSource } from 'typeorm';
import { ListImagesByOwnerUseCase } from '@/contexts/image-management/image/application/use-cases/list-images-by-owner.use-case';
import { ImageOwnerType } from '@/contexts/image-management/image/domain/enums/image-owner-type.enum';
import { ImageEntity } from '@/contexts/image-management/image/domain/entities/image.entity';
import { TypeOrmImageRepository } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { createPgMemImageDataSource } from '../../test-utils/create-pgmem-image-datasource';

describe('ListImagesByOwnerUseCase', () => {
  let dataSource: DataSource;
  let imageRepository: TypeOrmImageRepository;
  const ownerId = BigInt(42);

  beforeEach(async () => {
    dataSource = await createPgMemImageDataSource();
    imageRepository = new TypeOrmImageRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('devuelve sólo las imágenes activas del dueño, ordenadas por sortOrder', async () => {
    const useCase = new ListImagesByOwnerUseCase(imageRepository);

    const image1 = ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1);
    const image2 = ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k2', '/k2.jpg', 'image/jpeg', 10, false, 2);
    const otherOwnerImage = ImageEntity.create(ImageOwnerType.PRODUCT, BigInt(999), 'k3', '/k3.jpg', 'image/jpeg', 10, true, 1);

    await imageRepository.save(image2);
    await imageRepository.save(image1);
    await imageRepository.save(otherOwnerImage);

    const result = await useCase.execute(ImageOwnerType.PRODUCT, ownerId);

    expect(result).toHaveLength(2);
    expect(result.map((img) => img.sortOrder)).toEqual([1, 2]);
    expect(result.every((img) => img.ownerId === ownerId)).toBe(true);
  });

  it('devuelve una lista vacía si el dueño no tiene imágenes', async () => {
    const useCase = new ListImagesByOwnerUseCase(imageRepository);

    const result = await useCase.execute(ImageOwnerType.EMPLOYEE, BigInt(12345));

    expect(result).toEqual([]);
  });
});
