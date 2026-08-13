import { ImageStoragePort, UploadImageInput, UploadImageResult } from '@/shared/domain/ports/image-storage.port';

/**
 * Fake en memoria de `ImageStoragePort`, inyectado manualmente en los tests
 * de use-cases para no depender de filesystem real ni de Cloudinary.
 */
export class FakeImageStorage implements ImageStoragePort {
  public readonly uploaded: UploadImageInput[] = [];
  public readonly deleted: string[] = [];
  private counter = 0;

  async upload(input: UploadImageInput): Promise<UploadImageResult> {
    this.uploaded.push(input);
    this.counter += 1;
    const storageKey = `fake/${input.ownerType}/${input.ownerId}/${this.counter}.jpg`;
    return {
      storageKey,
      url: `/${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    this.deleted.push(storageKey);
  }
}
