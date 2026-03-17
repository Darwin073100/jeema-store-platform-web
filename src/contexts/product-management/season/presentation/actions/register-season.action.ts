'use server'
import { cookies } from 'next/headers';
import { TypeormSeasonRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { RegisterSeasonDto } from '../../application/dtos/register-season.dto';
import { RegisterSeasonUseCase } from '../../application/use-cases/register-season.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { Result } from '@/shared/features/result';
import { SeasonMapper } from '../../application/mappers/season-mapper';
import { revalidatePath } from 'next/cache';

export async function registerSeasonAction(dto: Omit<RegisterSeasonDto, 'establishmentId'>) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormSeasonRepository.create();
        const useCase = new RegisterSeasonUseCase(categoryRepo);

        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute({
            ...dto,
            establishmentId
        });

        revalidatePath('/products/list');

        return {
            ...Result.success(SeasonMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerSeasonAction: ', error);
        return {
            ...handleError(error, 'registerSeasonAction')
        };
    }
}