import {
  ImageProcessorPort,
  ProcessImageInput,
  ProcessImageResult,
} from '@/shared/domain/ports/image-processor.port';

/**
 * Fake en memoria de `ImageProcessorPort`, inyectado manualmente en los tests
 * de use-cases para no depender de `sharp` real. Por defecto simula una
 * "compresión" reduciendo el tamaño a la mitad; se puede sobreescribir el
 * resultado o forzar un fallo para probar la traducción a
 * `InvalidImageFileException` en `UploadImageUseCase`.
 */
export class FakeImageProcessor implements ImageProcessorPort {
  public readonly received: ProcessImageInput[] = [];

  constructor(
    private readonly resultOverride?: Partial<ProcessImageResult>,
    private readonly shouldFail = false,
  ) {}

  static thatFails(): FakeImageProcessor {
    return new FakeImageProcessor(undefined, true);
  }

  static withResultSizeBytes(sizeBytes: number): FakeImageProcessor {
    return new FakeImageProcessor({ sizeBytes });
  }

  async process(input: ProcessImageInput): Promise<ProcessImageResult> {
    this.received.push(input);

    if (this.shouldFail) {
      throw new Error('fake sharp failure: archivo no procesable');
    }

    const sizeBytes = this.resultOverride?.sizeBytes ?? Math.floor(input.buffer.byteLength / 2);
    return {
      buffer: Buffer.alloc(sizeBytes, 0),
      mimeType: this.resultOverride?.mimeType ?? 'image/webp',
      width: this.resultOverride?.width ?? 800,
      height: this.resultOverride?.height ?? 600,
      sizeBytes,
    };
  }
}
