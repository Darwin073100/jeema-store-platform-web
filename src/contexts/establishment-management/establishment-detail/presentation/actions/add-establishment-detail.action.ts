'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TypeOrmEstablishmentDetailRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-establishment-detail.repository';
import { AddEstablishmentDetailUseCase } from '../../application/use-cases/add-establishment-detail.use-case';
import { EstablishmentDetailTypeEnum } from '../../domain/enums/establishment-detail-type.enum';
import { EstablishmentDetailMapper } from '../../application/mappers/establishment-detail.mapper';
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function addEstablishmentDetailAction(
    establishmentId: bigint,
    type: EstablishmentDetailTypeEnum,
    value: string,
    sortOrder: number = 0,
){
    noStore(); // Evitar que se cachée este server action
    try {
        const repository = await TypeOrmEstablishmentDetailRepository.create();
        const useCase = new AddEstablishmentDetailUseCase(repository);

        const result = await useCase.execute(establishmentId, type, value, sortOrder);

        revalidatePath('/configurations/establishment');

        return {
            ...Result.success(EstablishmentDetailMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('addEstablishmentDetailAction: ', error);
        return {
            ...handleError(error, 'addEstablishmentDetailAction')
        }
    }
}
