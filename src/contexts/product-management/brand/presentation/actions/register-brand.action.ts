'use server'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { RegisterBrandDto } from '../../application/dtos/register-brand.dto';
import { TypeOrmBrandRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { RegisterBrandUseCase } from '../../application/use-cases/register-brand.use-case';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';
import { Result } from '@/shared/lib/utils/result';
import { BrandMapper } from '../../application/mappers/brand.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function registerBrandAction(dto: Omit<RegisterBrandDto, 'establishmentId'>) {
    try {
        // Inyeccion de las dependencias usando Factory
        const categoryRepo = await TypeOrmBrandRepository.create();
        const useCase = new RegisterBrandUseCase(categoryRepo);

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
            ...Result.success(BrandMapper.toIResponse(result))
        };
    } catch (error) {
        console.error('registerBrandAction: ', error);
        return {
            ...handleError(error, 'registerBrandAction')
        };
    }
} 