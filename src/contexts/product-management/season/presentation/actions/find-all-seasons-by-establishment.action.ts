'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { TypeormSeasonRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { FindAllSeasonsByEstablishmentUseCase } from '../../application/use-cases/find-all-seasons-by-establishment.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { SeasonMapper } from '../../application/mappers/season-mapper';

export async function findAllSeasonsByEstablishmentAction() {
    noStore(); // Evitar que se cachée este server action

    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeormSeasonRepository.create();
        const useCase = new FindAllSeasonsByEstablishmentUseCase(categoryRepo);

        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute(establishmentId);

        return result ? result.map(item => SeasonMapper.toIResponse(item)) : [];
    } catch (error) {
        console.error('findAllSeasonsByEstablishmentAction: ', error);
        return [];
    }
}