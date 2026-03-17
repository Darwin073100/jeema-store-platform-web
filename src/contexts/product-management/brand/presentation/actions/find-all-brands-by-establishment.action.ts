'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { TypeOrmBrandRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { FindAllBrandByEstablishmentUseCase } from '../../application/use-cases/find-all-brand-by-establishment.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { BrandMapper } from '../../application/mappers/brand.mapper';

export async function findAllBrandsByEstablishmentAction() {
    noStore(); // Evitar que se cachée este server action

    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeOrmBrandRepository.create();
        const useCase = new FindAllBrandByEstablishmentUseCase(categoryRepo);

        const cookieStore = await cookies();

        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }
        const result = await useCase.execute(establishmentId);

        return result ? result.map(item => BrandMapper.toIResponse(item)) : [];
    } catch (error) {
        console.error('findAllCategoriesByEstablishmentAction: ', error);
        return [];
    }
}