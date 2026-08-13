'use server'
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { DependencyFactory } from '@/shared/infrastructure/di/dependency-factory';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { DeleteImageUseCase } from '../../application/use-cases/delete-image.use-case';
import { TypeOrmImageRepository } from '../../infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { revalidateOwnerPaths } from './revalidate-owner-paths';

export async function deleteImageAction(ownerType: ImageOwnerType, imageId: bigint) {
    try {
        const imageRepository = await TypeOrmImageRepository.create();
        const imageStorage = DependencyFactory.getImageStorage();
        const imageOwnerGateway = await DependencyFactory.getImageOwnerGateway(ownerType);

        const useCase = new DeleteImageUseCase(imageRepository, imageStorage, imageOwnerGateway);
        await useCase.execute(imageId);

        revalidateOwnerPaths(ownerType);

        return { ...Result.success(true) };
    } catch (error) {
        console.error('deleteImageAction', error);
        return {
            ...handleError(error, 'deleteImageAction'),
        };
    }
}
