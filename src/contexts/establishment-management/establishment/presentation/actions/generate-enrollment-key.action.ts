'use server'
import { unstable_noStore as noStore } from 'next/cache';import { cookies } from 'next/headers';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { GenerateEnrollmentKeyUseCase } from '../../application/use-cases/generate-enrollment-key.use-case';
import { FetchCloudEstablishmentRepository } from '../../infraestruture/persistence/http/fetch-cloud-establishment.repository';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';

export async function generateEnrollmentKeyAction(): Promise<{
    ok: boolean;
    value?: { enrollmentKey: string; };
    error?: ErrorEntity | undefined;
}>{
    noStore(); // Evitar que se cachée este server action
    try {
        // Inyeccion de las dependencias usando Factory
        const repository = FetchCloudEstablishmentRepository.create();
        const useCase = new GenerateEnrollmentKeyUseCase(repository);

        const result = await useCase.execute();

        return {
            ...result
        }
    } catch (error) {
        console.error('findEstablishmentByIdAction: ', error);
        return {
            ...handleError(error, 'findEstablishmentByIdAction')
        }
    }
}