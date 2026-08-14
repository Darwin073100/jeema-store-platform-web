/**
 * Whitelist explícita de mimetypes permitidos para imágenes de cualquier
 * dueño (producto, empleado, establecimiento).
 */
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

/**
 * Detecta el mimetype real de una imagen inspeccionando sus primeros bytes
 * (magic numbers), en vez de confiar en la extensión del archivo o en el
 * `Content-Type` declarado por el cliente — ambos fácilmente falsificables.
 *
 * Devuelve `null` si el contenido no corresponde a ninguno de los formatos
 * soportados.
 */
export function detectImageMimeTypeFromBuffer(buffer: Buffer): AllowedImageMimeType | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Límite duro de subida cruda, en bytes, leído de `MAX_RAW_UPLOAD_SIZE_MB`
 * (default 15MB si no está definida o no es un número válido). Se aplica
 * ANTES de invocar `ImageProcessorPort`, para no gastar CPU procesando
 * archivos disparatadamente grandes — ver spect/01_gestion_imagenes_spect.md,
 * sección 4.
 */
export function getMaxRawUploadSizeBytes(): number {
  const raw = process.env.MAX_RAW_UPLOAD_SIZE_MB;
  const mb = raw ? Number(raw) : NaN;
  const safeMb = Number.isFinite(mb) && mb > 0 ? mb : 15;
  return safeMb * 1024 * 1024;
}

/**
 * Umbral de tamaño crudo, en bytes, leído de `IMAGE_COMPRESSION_THRESHOLD_KB`
 * (default 1024KB = 1MB). Por debajo (o igual) de este umbral, el archivo se
 * guarda tal cual, sin invocar `ImageProcessorPort`.
 */
export function getCompressionThresholdBytes(): number {
  const raw = process.env.IMAGE_COMPRESSION_THRESHOLD_KB;
  const kb = raw ? Number(raw) : NaN;
  const safeKb = Number.isFinite(kb) && kb > 0 ? kb : 1024;
  return safeKb * 1024;
}

/**
 * Cota de seguridad post-procesamiento, en bytes, leída de
 * `MAX_PROCESSED_IMAGE_SIZE_MB` (default 3MB). Si el archivo procesado (o el
 * original, cuando no superó el umbral de compresión) sigue excediendo esta
 * cota, se rechaza — red de seguridad para el caso anómalo en que ni
 * redimensionar ni comprimir alcanza.
 */
export function getMaxProcessedImageSizeBytes(): number {
  const raw = process.env.MAX_PROCESSED_IMAGE_SIZE_MB;
  const mb = raw ? Number(raw) : NaN;
  const safeMb = Number.isFinite(mb) && mb > 0 ? mb : 3;
  return safeMb * 1024 * 1024;
}
