'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TypeOrmEstablishmentDetailRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-establishment-detail.repository';
import { UpdateEstablishmentDetailUseCase } from '../../application/use-cases/update-establishment-detail.use-case';
import { EstablishmentDetailMapper } from '../../application/mappers/establishment-detail.mapper';
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function updateEstablishmentDetailAction(establishmentDetailId: bigint, newValue: string){
    noStore(); // Evitar que se cachée este server action
    try {
        const repository = await TypeOrmEstablishmentDetailRepository.create();
        const useCase = new UpdateEstablishmentDetailUseCase(repository);

        const result = await useCase.execute(establishmentDetailId, newValue);

        revalidatePath('/configurations/establishment');

        return {
            ...Result.success(EstablishmentDetailMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('updateEstablishmentDetailAction: ', error);
        return {
            ...handleError(error, 'updateEstablishmentDetailAction')
        }
    }
}
