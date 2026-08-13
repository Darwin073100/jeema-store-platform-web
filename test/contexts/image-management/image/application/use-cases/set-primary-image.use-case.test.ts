import { DataSource } from 'typeorm';
import { SetPrimaryImageUseCase } from '@/contexts/image-management/image/application/use-cases/set-primary-image.use-case';
import { ImageOwnerType } from '@/contexts/image-management/image/domain/enums/image-owner-type.enum';
import { ImageEntity } from '@/contexts/image-management/image/domain/entities/image.entity';
import { ImageNotFoundException } from '@/contexts/image-management/image/domain/exceptions/image-not-found.exception';
import { TypeOrmImageRepository } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { createPgMemImageDataSource } from '../../test-utils/create-pgmem-image-datasource';
import { FakeImageOwnerGateway } from '../../test-utils/fake-image-owner-gateway';

describe('SetPrimaryImageUseCase', () => {
  let dataSource: DataSource;
  let imageRepository: TypeOrmImageRepository;
  const ownerId = BigInt(7);

  beforeEach(async () => {
    dataSource = await createPgMemImageDataSource();
    imageRepository = new TypeOrmImageRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('desmarca la principal anterior, marca la nueva y sincroniza el dueño', async () => {
    const currentPrimary = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1),
    );
    const candidate = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k2', '/k2.jpg', 'image/jpeg', 10, false, 2),
    );

    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new SetPrimaryImageUseCase(imageRepository, ownerGateway);

    const result = await useCase.execute(candidate.imageId);

    expect(result.isPrimary).toBe(true);
    expect(ownerGateway.primaryImageUrlUpdates).toEqual([{ ownerId, url: candidate.url }]);

    const reloadedPrevious = await imageRepository.findById(currentPrimary.imageId);
    expect(reloadedPrevious?.isPrimary).toBe(false);
  });

  it('es un no-op si la imagen ya es la principal', async () => {
    const alreadyPrimary = await imageRepository.save(
      ImageEntity.create(ImageOwnerType.PRODUCT, ownerId, 'k1', '/k1.jpg', 'image/jpeg', 10, true, 1),
    );

    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new SetPrimaryImageUseCase(imageRepository, ownerGateway);

    const result = await useCase.execute(alreadyPrimary.imageId);

    expect(result.isPrimary).toBe(true);
    expect(ownerGateway.primaryImageUrlUpdates).toHaveLength(0);
  });

  it('lanza ImageNotFoundException si la imagen no existe', async () => {
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new SetPrimaryImageUseCase(imageRepository, ownerGateway);

    await expect(useCase.execute(BigInt(999999))).rejects.toBeInstanceOf(ImageNotFoundException);
  });
});
