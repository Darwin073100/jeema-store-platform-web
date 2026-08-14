import sharp from 'sharp';
import {
  ImageProcessorPort,
  ProcessImageInput,
  ProcessImageResult,
} from '@/shared/domain/ports/image-processor.port';

type OutputFormat = 'webp' | 'jpeg' | 'png';

const MIME_TYPE_BY_FORMAT: Record<OutputFormat, string> = {
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

function getMaxDimensionPx(): number {
  const raw = process.env.IMAGE_MAX_DIMENSION_PX;
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : 1920;
}

function getQuality(): number {
  const raw = process.env.IMAGE_COMPRESSION_QUALITY;
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 && value <= 100 ? value : 80;
}

function getOutputFormat(): OutputFormat {
  const raw = (process.env.IMAGE_OUTPUT_FORMAT ?? 'webp').toLowerCase();
  if (raw === 'jpeg' || raw === 'jpg') return 'jpeg';
  if (raw === 'png') return 'png';
  return 'webp';
}

/**
 * SharpImageProcessorAdapter implementa `ImageProcessorPort` usando `sharp` —
 * el único punto del código que sabe que existe `sharp`. Redimensiona
 * manteniendo aspect ratio, re-codifica al formato/calidad configurados por
 * variables de entorno y aplica auto-rotación según el EXIF `Orientation` de
 * la foto original *antes* de descartar los metadatos al re-codificar (sin
 * este paso, fotos tomadas en vertical con un celular se verían rotadas 90°).
 *
 * Nota de capas: este adaptador vive en `shared/infrastructure` y por eso NO
 * importa `InvalidImageFileException` (que pertenece al bounded context
 * `image-management`) — el shared kernel no depende de un contexto
 * específico. En su lugar lanza un `Error` genérico y descriptivo; es
 * `UploadImageUseCase` (que sí conoce esa excepción de dominio) quien la
 * traduce, igual que ya hace con los errores de `ImageRepository.save()`.
 */
export class SharpImageProcessorAdapter implements ImageProcessorPort {
  async process(input: ProcessImageInput): Promise<ProcessImageResult> {
    const maxDimension = getMaxDimensionPx();
    const quality = getQuality();
    const format = getOutputFormat();

    try {
      const pipeline = sharp(input.buffer)
        // Auto-rotación EXIF antes de descartar metadata (sin argumentos, sharp
        // lee el Orientation EXIF y rota/espeja según corresponda).
        .rotate()
        .resize({
          width: maxDimension,
          height: maxDimension,
          fit: 'inside',
          withoutEnlargement: true,
        });

      const encodedPipeline =
        format === 'webp'
          ? pipeline.webp({ quality })
          : format === 'jpeg'
            ? pipeline.jpeg({ quality })
            : pipeline.png({ quality });

      const { data, info } = await encodedPipeline.toBuffer({ resolveWithObject: true });

      return {
        buffer: data,
        mimeType: MIME_TYPE_BY_FORMAT[format],
        width: info.width,
        height: info.height,
        sizeBytes: data.byteLength,
      };
    } catch {
      throw new Error(
        'No fue posible procesar la imagen: el archivo podría estar corrupto, truncado o su formato no es compatible.',
      );
    }
  }
}
