'use server'
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ListImagesByOwnerUseCase } from '../../application/use-cases/list-images-by-owner.use-case';
import { ImageMapper } from '../../application/mappers/image.mapper';
import { TypeOrmImageRepository } from '../../infraestructura/persistence/typeorm/repositories/typeorm-image.repository';

export async function listImagesByOwnerAction(ownerType: ImageOwnerType, ownerId: bigint) {
    try {
        const imageRepository = await TypeOrmImageRepository.create();
        const useCase = new ListImagesByOwnerUseCase(imageRepository);

        const result = await useCase.execute(ownerType, ownerId);

        return {
            ...Result.success(result.map((image) => ImageMapper.toIResponse(image))),
        };
    } catch (error) {
        console.error('listImagesByOwnerAction', error);
        return {
            ...handleError(error, 'listImagesByOwnerAction'),
        };
    }
}
