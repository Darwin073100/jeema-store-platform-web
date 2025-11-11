'use server'
import { revalidatePath } from 'next/cache';
import { RegisterBrandDTO } from "../application/dtos/register-brand.dto";
import { RegisterBrandUseCase } from "../application/use-case/register-brand.use-case";
import { BrandRepositoryFactory } from '../infraestructure/factories/brand-repository.factory';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';

export async function registerBrandAction(dto: Omit<RegisterBrandDTO, 'establishmentId'>){
    const brandFetchRepositoryImpl = BrandRepositoryFactory.create();
    const registerBrandUseCase = new RegisterBrandUseCase(brandFetchRepositoryImpl);

    const cookieStore = await cookies();
    let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
    let establishmentId = BigInt(0);
    if (establishment) {
        establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
    }

    const currentDTO = {
        ...dto,
        establishmentId,
    }

    const result = await registerBrandUseCase.execute(currentDTO);

    // Invalidar el caché de la página de productos para que se actualicen los datos
    if (result?.ok) {
        revalidatePath('/products');
    }
    
    return {
        ...result
    }
} 