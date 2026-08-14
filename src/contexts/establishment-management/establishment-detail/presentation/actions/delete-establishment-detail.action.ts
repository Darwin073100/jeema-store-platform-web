'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TypeOrmEstablishmentDetailRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-establishment-detail.repository';
import { DeleteEstablishmentDetailUseCase } from '../../application/use-cases/delete-establishment-detail.use-case';
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function deleteEstablishmentDetailAction(establishmentDetailId: bigint){
    noStore(); // Evitar que se cachée este server action
    try {
        const repository = await TypeOrmEstablishmentDetailRepository.create();
        const useCase = new DeleteEstablishmentDetailUseCase(repository);

        await useCase.execute(establishmentDetailId);

        revalidatePath('/configurations/establishment');

        return {
            ...Result.success(true)
        }
    } catch (error) {
        console.error('deleteEstablishmentDetailAction: ', error);
        return {
            ...handleError(error, 'deleteEstablishmentDetailAction')
        }
    }
}
