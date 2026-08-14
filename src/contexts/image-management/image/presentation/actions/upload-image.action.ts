'use server'
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { DependencyFactory } from '@/shared/infrastructure/di/dependency-factory';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { UploadImageDto } from '../../application/dtos/upload-image.dto';
import { ImageMapper } from '../../application/mappers/image.mapper';
import { TypeOrmImageRepository } from '../../infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { revalidateOwnerPaths } from './revalidate-owner-paths';
import { ALLOWED_IMAGE_MIME_TYPES, getMaxRawUploadSizeBytes } from '../../application/services/image-content-validator';

/**
 * Sube una imagen para un dueño (`ownerType` + `ownerId`). El archivo binario
 * viaja en `formData` bajo la clave `'file'`.
 */
export async function uploadImageAction(ownerType: ImageOwnerType, ownerId: bigint, formData: FormData) {
    try {
        const file = formData.get('file');
        if (!(file instanceof File)) {
            throw new Error('No se recibió ningún archivo bajo la clave "file".');
        }

        // Validación rápida de tipo/tamaño crudo antes de invocar el use-case,
        // basada en lo declarado por el cliente (extensión/Content-Type). No
        // reemplaza la validación por contenido real que hace el use-case, sólo
        // evita trabajo (lectura de repositorios, DB) para casos obviamente
        // inválidos.
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
            throw new Error('Tipo de archivo no permitido. Sólo se aceptan imágenes JPEG, PNG o WEBP.');
        }
        const maxRawBytes = getMaxRawUploadSizeBytes();
        if (file.size > maxRawBytes) {
            throw new Error(`La imagen excede el tamaño máximo de subida de ${Math.round(maxRawBytes / (1024 * 1024))}MB.`);
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imageRepository = await TypeOrmImageRepository.create();
        const imageStorage = DependencyFactory.getImageStorage();
        const imageProcessor = DependencyFactory.getImageProcessor();
        const imageOwnerGateway = await DependencyFactory.getImageOwnerGateway(ownerType);

        const useCase = new UploadImageUseCase(imageRepository, imageStorage, imageOwnerGateway, imageProcessor);

        const dto = new UploadImageDto(ownerType, ownerId, buffer, file.name, file.type, buffer.byteLength);
        const result = await useCase.execute(dto);

        revalidateOwnerPaths(ownerType);

        return {
            ...Result.success(ImageMapper.toIResponse(result)),
        };
    } catch (error) {
        console.error('uploadImageAction', error);
        return {
            ...handleError(error, 'uploadImageAction'),
        };
    }
}
