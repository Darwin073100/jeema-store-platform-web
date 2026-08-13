export const IMAGE_STORAGE_PORT = Symbol('IMAGE_STORAGE_PORT');

/**
 * Datos de entrada para subir un archivo binario a un almacenamiento
 * (local o cloud), agnóstico al dueño de la imagen.
 */
export interface UploadImageInput {
  /** Contenido binario del archivo. */
  buffer: Buffer;
  /** Nombre de archivo original, usado únicamente para inferir la extensión. */
  originalFileName: string;
  /** Mime type ya validado por el llamador (whitelist jpeg/png/webp). */
  mimeType: string;
  /** Tipo de dueño, en minúsculas/slug (p. ej. 'product'), usado para namespacing. */
  ownerType: string;
  /** Id del dueño, usado para namespacing. */
  ownerId: string;
}

/**
 * Resultado de una subida exitosa.
 */
export interface UploadImageResult {
  /** Clave interna del storage, necesaria para poder eliminar el archivo después. */
  storageKey: string;
  /** URL pública/servible del archivo subido. */
  url: string;
}

/**
 * ImageStoragePort desacopla a los use-cases de `image-management` de
 * *dónde* se guarda físicamente el archivo binario de una imagen.
 *
 * Dos implementaciones concretas conviven en `shared/infrastructure/storage/`:
 * una para filesystem local (instalaciones on-premise) y otra para un
 * proveedor cloud (Cloudinary), seleccionadas en runtime por
 * `DependencyFactory.getImageStorage()`.
 */
export interface ImageStoragePort {
  upload(input: UploadImageInput): Promise<UploadImageResult>;
  delete(storageKey: string): Promise<void>;
}
