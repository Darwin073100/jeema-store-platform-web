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
 * Límite de tamaño por imagen, en bytes, leído de `MAX_IMAGE_SIZE_MB`
 * (default 2MB si no está definida o no es un número válido).
 */
export function getMaxImageSizeBytes(): number {
  const raw = process.env.MAX_IMAGE_SIZE_MB;
  const mb = raw ? Number(raw) : NaN;
  const safeMb = Number.isFinite(mb) && mb > 0 ? mb : 2;
  return safeMb * 1024 * 1024;
}
