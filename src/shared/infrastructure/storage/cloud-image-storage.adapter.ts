import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import {
  ImageStoragePort,
  UploadImageInput,
  UploadImageResult,
} from 'src/shared/domain/ports/image-storage.port';

/**
 * CloudImageStorageAdapter sube el archivo a Cloudinary (proveedor cloud
 * confirmado). Usado en despliegues serverless (Vercel), donde no hay disco
 * persistente entre invocaciones.
 */
export class CloudImageStorageAdapter implements ImageStoragePort {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(input: UploadImageInput): Promise<UploadImageResult> {
    const folder = `${input.ownerType}/${input.ownerId}`;

    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          // Cloudinary genera un public_id único por defecto; no derivamos
          // el nombre del archivo original subido por el usuario.
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary no devolvió un resultado de subida.'));
            return;
          }
          resolve(result);
        },
      );
      uploadStream.end(input.buffer);
    });

    return {
      // public_id (incluye la carpeta) es lo necesario para poder eliminar el archivo después.
      storageKey: response.public_id,
      url: response.secure_url,
    };
  }

  async delete(storageKey: string): Promise<void> {
    await cloudinary.uploader.destroy(storageKey, { resource_type: 'image' });
  }
}
