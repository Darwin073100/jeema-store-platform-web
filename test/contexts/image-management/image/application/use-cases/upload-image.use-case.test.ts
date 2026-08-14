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
import { FakeImageProcessor } from '../../test-utils/fake-image-processor';

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
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

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
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

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
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

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
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buildJpegBuffer(), 'a.jpg', 'image/jpeg', 1024);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageOwnerException);
  });

  it('lanza InvalidImageFileException si el contenido no corresponde a un formato permitido', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

    const notAnImage = Buffer.from('esto no es una imagen, es texto plano');
    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, notAnImage, 'fake.jpg', 'image/jpeg', notAnImage.byteLength);

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
  });

  it('lanza InvalidImageFileException si el tamaño crudo excede MAX_RAW_UPLOAD_SIZE_MB', async () => {
    const previousEnv = process.env.MAX_RAW_UPLOAD_SIZE_MB;
    process.env.MAX_RAW_UPLOAD_SIZE_MB = '1';

    try {
      const storage = new FakeImageStorage();
      const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
      const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, new FakeImageProcessor());

      const oversized = buildJpegBuffer(2 * 1024 * 1024);
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, oversized, 'big.jpg', 'image/jpeg', oversized.byteLength);

      await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
    } finally {
      process.env.MAX_RAW_UPLOAD_SIZE_MB = previousEnv;
    }
  });

  it('no invoca ImageProcessorPort cuando el crudo no supera IMAGE_COMPRESSION_THRESHOLD_KB', async () => {
    const storage = new FakeImageStorage();
    const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
    const processor = new FakeImageProcessor();
    const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, processor);

    // Default IMAGE_COMPRESSION_THRESHOLD_KB es 1024KB (1MB); un buffer de 1KB queda muy por debajo.
    const buffer = buildJpegBuffer(1024);
    const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buffer, 'a.jpg', 'image/jpeg', buffer.byteLength);

    const image = await useCase.execute(dto);

    expect(processor.received).toHaveLength(0);
    expect(image.mimeType).toBe('image/jpeg');
    expect(image.sizeBytes).toBe(buffer.byteLength);
  });

  it('invoca ImageProcessorPort y persiste el resultado procesado cuando el crudo supera el umbral de compresión', async () => {
    const previousEnv = process.env.IMAGE_COMPRESSION_THRESHOLD_KB;
    process.env.IMAGE_COMPRESSION_THRESHOLD_KB = '1'; // 1KB, para forzar la compresión con un buffer chico en el test

    try {
      const storage = new FakeImageStorage();
      const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
      const processor = FakeImageProcessor.withResultSizeBytes(500);
      const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, processor);

      const buffer = buildJpegBuffer(2048);
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buffer, 'a.jpg', 'image/jpeg', buffer.byteLength);

      const image = await useCase.execute(dto);

      expect(processor.received).toHaveLength(1);
      expect(image.mimeType).toBe('image/webp');
      expect(image.sizeBytes).toBe(500);
    } finally {
      process.env.IMAGE_COMPRESSION_THRESHOLD_KB = previousEnv;
    }
  });

  it('lanza InvalidImageFileException si el resultado procesado sigue excediendo MAX_PROCESSED_IMAGE_SIZE_MB', async () => {
    const previousThreshold = process.env.IMAGE_COMPRESSION_THRESHOLD_KB;
    const previousMaxProcessed = process.env.MAX_PROCESSED_IMAGE_SIZE_MB;
    process.env.IMAGE_COMPRESSION_THRESHOLD_KB = '1';
    process.env.MAX_PROCESSED_IMAGE_SIZE_MB = '0.001'; // ~1048 bytes

    try {
      const storage = new FakeImageStorage();
      const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
      const processor = FakeImageProcessor.withResultSizeBytes(5000);
      const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, processor);

      const buffer = buildJpegBuffer(2048);
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buffer, 'a.jpg', 'image/jpeg', buffer.byteLength);

      await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
      expect(storage.uploaded).toHaveLength(0);
    } finally {
      process.env.IMAGE_COMPRESSION_THRESHOLD_KB = previousThreshold;
      process.env.MAX_PROCESSED_IMAGE_SIZE_MB = previousMaxProcessed;
    }
  });

  it('traduce un fallo de ImageProcessorPort a InvalidImageFileException', async () => {
    const previousEnv = process.env.IMAGE_COMPRESSION_THRESHOLD_KB;
    process.env.IMAGE_COMPRESSION_THRESHOLD_KB = '1';

    try {
      const storage = new FakeImageStorage();
      const ownerGateway = FakeImageOwnerGateway.withExistingOwner(ownerId);
      const processor = FakeImageProcessor.thatFails();
      const useCase = new UploadImageUseCase(imageRepository, storage, ownerGateway, processor);

      const buffer = buildJpegBuffer(2048);
      const dto = new UploadImageDto(ImageOwnerType.PRODUCT, ownerId, buffer, 'a.jpg', 'image/jpeg', buffer.byteLength);

      await expect(useCase.execute(dto)).rejects.toBeInstanceOf(InvalidImageFileException);
    } finally {
      process.env.IMAGE_COMPRESSION_THRESHOLD_KB = previousEnv;
    }
  });
});
