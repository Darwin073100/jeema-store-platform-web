'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { BrandRepositoryFactory } from '../infraestructure/factories/brand-repository.factory';
import { FindAllBrandsByEstablishmentUseCase } from '../application/use-case/find-all-brands-by-establishment.use-case';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { cookies } from 'next/headers';

export async function findAllBrandsByEstablishmentAction(){
    noStore(); // Evitar que se cachée este server action
    
    const brandFetchRepositoryImpl = BrandRepositoryFactory.create();
    const useCase = new FindAllBrandsByEstablishmentUseCase(brandFetchRepositoryImpl);

    const cookieStore = await cookies();
        
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }

    const result = await useCase.execute(establishmentId);
    
    return {
        ...result
    }
}