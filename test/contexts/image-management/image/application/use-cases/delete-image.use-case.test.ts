import { DataSource } from 'typeorm';
import { DeleteImageUseCase } from '@/contexts/image-management/image/application/use-cases/delete-image.use-case';
import { ImageOwnerType } from '@/contexts/image-management/image/domain/enums/image-owner-type.enum';
import { ImageEntity } from '@/contexts/image-management/image/domain/entities/image.entity';
import { ImageNotFoundException } from '@/contexts/image-management/image/domain/exceptions/image-not-found.exception';
import { TypeOrmImageRepository } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { createPgMemImageDataSource } from '../../test-utils/create-pgmem-image-datasource';
import { FakeImageStorage } from '../../test-utils/fake-image-storage';
import { FakeImageOwnerGateway } from '../../test-utils/fake-image-owner-gateway';

describe('DeleteImageUseCase', () => {
  let dataSource: DataSource;
  let imageRepository: TypeOrmImageRepository;
  const ownerId = BigInt(3);

  beforeEach(async () => {
    dataSource = await createPgMemImageDataSource();
    imageRepository = new TypeOrmImageRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('al eliminar la imagen principal promueve la de menor sortOrder', async () => {
    const primary = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1),
    );
    const secondary = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k2', '/k2.jpg', 'image/jpeg', 10, false, 2),
    );

    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new DeleteImageUseCase(imageRepository, storage, ownerGateway);

    await useCase.execute(primary.imageId);

    expect(storage.deleted).toEqual(['k1']);

    const remaining = await imageRepository.findActiveByOwner(ImageOwnerType.PRODUCT, ownerId);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].imageId).toBe(secondary.imageId);
    expect(remaining[0].isPrimary).toBe(true);

    expect(ownerGateway.primaryImageUrlUpdates).toEqual([{ ownerId, url: secondary.url }]);
  });

  it('al eliminar la única imagen (principal) limpia el campo denormalizado del dueño', async () => {
    const onlyImage = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1),
    );

    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new DeleteImageUseCase(imageRepository, storage, ownerGateway);

    await useCase.execute(onlyImage.imageId);

    const remaining = await imageRepository.findActiveByOwner(ImageOwnerType.PRODUCT, ownerId);
    expect(remaining).toHaveLength(0);
    expect(ownerGateway.primaryImageUrlUpdates).toEqual([{ ownerId, url: null }]);
  });

  it('al eliminar una imagen no principal no toca el campo denormalizado del dueño', async () => {
    await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1),
    );
    const secondary = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k2', '/k2.jpg', 'image/jpeg', 10, false, 2),
    );

    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new DeleteImageUseCase(imageRepository, storage, ownerGateway);

    await useCase.execute(secondary.imageId);

    expect(ownerGateway.primaryImageUrlUpdates).toHaveLength(0);
  });

  it('lanza ImageNotFoundException si la imagen no existe', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new DeleteImageUseCase(imageRepository, storage, ownerGateway);

    await expect(useCase.execute(BigInt(999999))).rejects.toBeInstanceOf(ImageNotFoundException);
  });
});
