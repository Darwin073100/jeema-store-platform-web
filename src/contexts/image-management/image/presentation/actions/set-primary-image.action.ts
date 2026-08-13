'use server'
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { DependencyFactory } from '@/shared/infrastructure/di/dependency-factory';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { SetPrimaryImageUseCase } from '../../application/use-cases/set-primary-image.use-case';
import { ImageMapper } from '../../application/mappers/image.mapper';
import { TypeOrmImageRepository } from '../../infraestructura/persistence/typeorm/repositories/typeorm-image.repository';
import { revalidateOwnerPaths } from './revalidate-owner-paths';

export async function setPrimaryImageAction(ownerType: ImageOwnerType, imageId: bigint) {
    try {
        const imageRepository = await TypeOrmImageRepository.create();
        const imageOwnerGateway = await DependencyFactory.getImageOwnerGateway(ownerType);

        const useCase = new SetPrimaryImageUseCase(imageRepository, imageOwnerGateway);
        const result = await useCase.execute(imageId);

        revalidateOwnerPaths(ownerType);

        return {
            ...Result.success(ImageMapper.toIResponse(result)),
        };
    } catch (error) {
        console.error('setPrimaryImageAction', error);
        return {
            ...handleError(error, 'setPrimaryImageAction'),
        };
    }
}
