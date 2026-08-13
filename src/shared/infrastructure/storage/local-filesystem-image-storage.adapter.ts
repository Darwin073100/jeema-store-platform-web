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

const EXTENSION_TO_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_TO_EXTENSION).map(([mimeType, extension]) => [extension, mimeType]),
);

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
 * LocalFilesystemImageStorageAdapter escribe el archivo en `storage/uploads/`
 * en la raíz del proyecto — deliberadamente FUERA de `public/`. `next start`
 * (modo producción) sólo escanea `public/` una vez al arrancar para resolver
 * qué rutas son archivos estáticos (`setupFsCheck` en
 * `next/dist/server/lib/router-utils/filesystem.js`); un archivo escrito ahí
 * después de ese escaneo no se sirve hasta reiniciar el proceso. Al vivir
 * fuera de `public/`, el archivo se sirve siempre vía el route handler
 * dinámico `src/app/uploads/[...path]/route.ts`, que lee del disco en cada
 * request — válido porque el modo local corre como proceso persistente
 * (on-premise), no serverless.
 */
export class LocalFilesystemImageStorageAdapter implements ImageStoragePort {
  private readonly storageRoot: string;

  constructor(basePath: string = process.env.LOCAL_IMAGE_STORAGE_PATH ?? 'uploads') {
    this.storageRoot = path.join(process.cwd(), 'storage', basePath);
  }

  /**
   * Resuelve un storageKey a una ruta absoluta, verificando que el destino
   * siga contenido dentro de `storageRoot` (defensa en profundidad contra
   * path traversal).
   */
  private resolveAbsolutePath(storageKey: string): string {
    const absolutePath = path.join(this.storageRoot, ...storageKey.split('/'));

    const relativeCheck = path.relative(this.storageRoot, absolutePath);
    if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
      throw new Error('Ruta de almacenamiento local resuelta fuera del directorio de almacenamiento permitido.');
    }

    return absolutePath;
  }

  async upload(input: UploadImageInput): Promise<UploadImageResult> {
    const extension = MIME_TO_EXTENSION[input.mimeType];
    if (!extension) {
      throw new Error(`Tipo de imagen no soportado por el almacenamiento local: '${input.mimeType}'`);
    }

    const ownerTypeSegment = sanitizePathSegment(input.ownerType);
    const ownerIdSegment = sanitizePathSegment(input.ownerId);
    const fileName = `${uuid()}${extension}`;

    // storageKey es relativo a storageRoot, con separadores '/' (también en Windows).
    const storageKey = [ownerTypeSegment, ownerIdSegment, fileName].join('/');
    const absoluteDestination = this.resolveAbsolutePath(storageKey);

    await fs.mkdir(path.dirname(absoluteDestination), { recursive: true });
    await fs.writeFile(absoluteDestination, input.buffer);

    return {
      storageKey,
      // Servida por el route handler dinámico, no por el árbol estático de /public.
      url: `/uploads/${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const absolutePath = this.resolveAbsolutePath(storageKey);

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

  /**
   * Lee un archivo del storage local para el route handler de subidas.
   * Devuelve `null` si no existe o su extensión no está en la whitelist,
   * en vez de lanzar, para que el caller responda 404 sin distinguir casos.
   */
  async read(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    const absolutePath = this.resolveAbsolutePath(storageKey);
    const mimeType = EXTENSION_TO_MIME[path.extname(absolutePath).toLowerCase()];
    if (!mimeType) {
      return null;
    }

    try {
      const buffer = await fs.readFile(absolutePath);
      return { buffer, mimeType };
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }
}
