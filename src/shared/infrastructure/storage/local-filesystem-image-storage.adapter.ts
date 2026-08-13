import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import {
  ImageStoragePort,
  UploadImageInput,
  UploadImageResult,
} from 'src/shared/domain/ports/image-storage.port';

/**
 * Mapa cerrado mime -> extensión. Nunca se deriva la extensión del nombre de
 * archivo original subido por el usuario (evita path traversal / spoofing).
 */
const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/**
 * Sanitiza un segmento de ruta calculado (ownerType/ownerId) para que nunca
 * pueda escribir fuera del árbol de subidas local: sólo se permiten
 * caracteres alfanuméricos, guion y guion bajo.
 */
function sanitizePathSegment(segment: string): string {
  const sanitized = segment.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!sanitized) {
    throw new Error(`Segmento de ruta inválido para almacenamiento local: '${segment}'`);
  }
  return sanitized;
}

/**
 * LocalFilesystemImageStorageAdapter escribe el archivo en un directorio
 * dentro de `public/`, para que Next.js lo sirva directamente sin necesidad
 * de una ruta API dedicada — válido porque el modo local corre como proceso
 * persistente (on-premise), no serverless.
 */
export class LocalFilesystemImageStorageAdapter implements ImageStoragePort {
  constructor(
    private readonly basePathWithinPublic: string = process.env.LOCAL_IMAGE_STORAGE_PATH ?? 'uploads',
  ) {}

  async upload(input: UploadImageInput): Promise<UploadImageResult> {
    const extension = MIME_TO_EXTENSION[input.mimeType];
    if (!extension) {
      throw new Error(`Tipo de imagen no soportado por el almacenamiento local: '${input.mimeType}'`);
    }

    const ownerTypeSegment = sanitizePathSegment(input.ownerType);
    const ownerIdSegment = sanitizePathSegment(input.ownerId);
    const fileName = `${uuid()}${extension}`;

    // storageKey es siempre relativo a /public, con separadores '/' (también en Windows),
    // para que pueda usarse tal cual como URL pública.
    const storageKey = [this.basePathWithinPublic, ownerTypeSegment, ownerIdSegment, fileName].join('/');

    const publicDir = path.join(process.cwd(), 'public');
    const absoluteDestination = path.join(publicDir, ...storageKey.split('/'));

    // Defensa en profundidad: el destino resuelto debe seguir contenido dentro de /public.
    const relativeCheck = path.relative(publicDir, absoluteDestination);
    if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
      throw new Error('Ruta de almacenamiento local resuelta fuera del directorio público permitido.');
    }

    await fs.mkdir(path.dirname(absoluteDestination), { recursive: true });
    await fs.writeFile(absoluteDestination, input.buffer);

    return {
      storageKey,
      url: `/${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const publicDir = path.join(process.cwd(), 'public');
    const absolutePath = path.join(publicDir, ...storageKey.split('/'));

    const relativeCheck = path.relative(publicDir, absolutePath);
    if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
      throw new Error('Ruta de almacenamiento local resuelta fuera del directorio público permitido.');
    }

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      // Si el archivo ya no existe, no es un error para efectos de esta operación.
      if (err.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
