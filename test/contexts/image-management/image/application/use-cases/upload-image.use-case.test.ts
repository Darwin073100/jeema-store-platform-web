import { DataSource } from 'typeorm';
import { UploadImageUseCase } from '@/contexts/image-management/image/application/use-cases/upload-image.use-case';
import { UploadImageDto } from '@/contexts/image-management/image/application/dtos/upload-image.dto';
import { ImageOwnerType } from '@/contexts/image-management/image/domain/enums/image-owner-type.enum';
import { TypeOrmImageRepository } from '@/contexts/image-management/image/infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { ImageLimitExceededException } from '@/contexts/image-management/image/domain/exceptions/image-limit-exceeded.exception';
import { InvalidImageOwnerException } from '@/contexts/image-management/image/domain/exceptions/invalid-image-owner.exception';
import { InvalidImageFileException } from '@/contexts/image-management/image/domain/exceptions/invalid-image-file.exception';
import { createPgMemImageDataSource } from '../../test-utils/create-pgmem-image-datasource';
import { FakeImageStorage } from '../../test-utils/fake-image-storage';
import { FakeImageOwnerGateway } from '../../test-utils/fake-image-owner-gateway';

const JPEG_MAGIC_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

function buildJpegBuffer(sizeBytes = 1024): Buffer {
  const filler = Buffer.alloc(Math.max(0, sizeBytes - JPEG_MAGIC_BYTES.length), 0);
  return Buffer.concat([JPEG_MAGIC_BYTES, filler]);
}

describe('UploadImageUseCase', () => {
  let dataSource: DataSource;
  let imageRepository: TypeOrmImageRepository;
  const ownerId = BigInt(1);

  beforeEach(async () => {
    dataSource = await createPgMemImageDataSource();
    imageRepository = new TypeOrmImageRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('marca como principal la primera imagen subida y sincroniza el dueño', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

    const buffer = buildJpegBuffer();
    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buffer, 'foto.jpg', 'image/jpeg', buffer.byteLength);

    const image = await useCase.execute(dto);

    expect(image.isPrimary).toBe(true);
    expect(image.sortOrder).toBe(1);
    expect(image.mimeType).toBe('image/jpeg');
    expect(ownerGateway.primaryImageUrlUpdates).toHaveLength(1);
    expect(ownerGateway.primaryImageUrlUpdates[0]).toEqual({ ownerId, url: image.url });
  });

  it('no marca como principal la segunda imagen y no vuelve a sincronizar el dueño', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

    const dto1 = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), 'a.jpg', 'image/jpeg', 1024);
    await useCase.execute(dto1);

    const dto2 = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), 'b.jpg', 'image/jpeg', 1024);
    const second = await useCase.execute(dto2);

    expect(second.isPrimary).toBe(false);
    expect(second.sortOrder).toBe(2);
    expect(ownerGateway.primaryImageUrlUpdates).toHaveLength(1);
  });

  it('lanza ImageLimitExceededException al intentar subir una cuarta imagen activa', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

    for (let i = 0; i < 3; i++) {
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), `img${i}.jpg`, 'image/jpeg', 1024);
      await useCase.execute(dto);
    }

    const fourthDto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), 'img4.jpg', 'image/jpeg', 1024);

    await expect(useCase.execute(fourthDto)).rejects.toBeInstanceOf(ImageLimitExceededException);
  });

  it('lanza InvalidImageOwnerException si el dueño no existe', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = new FakeImageOwnerGateway(); // sin dueños registrados
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), 'a.jpg', 'image/jpeg', 1024);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageOwnerException);
  });

  it('lanza InvalidImageFileException si el contenido no corresponde a un formato permitido', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

    const notAnImage = Buffer.from('esto no es una imagen, es texto plano');
    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, notAnImage, 'fake.jpg', 'image/jpeg', notAnImage.byteLength);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
  });

  it('lanza InvalidImageFileException si el tamaño excede MAX_IMAGE_SIZE_MB', async () => {
    const previousEnv = process.env.MAX_IMAGE_SIZE_MB;
    process.env.MAX_IMAGE_SIZE_MB = '1';

    try {
      const storage = new FakeImageStorage();
      const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
      const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway);

      const oversized = buildJpegBuffer(2 * 1024 * 1024);
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, oversized, 'big.jpg', 'image/jpeg', oversized.byteLength);

      await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
    } finally {
      process.env.MAX_IMAGE_SIZE_MB = previousEnv;
    }
  });
});
