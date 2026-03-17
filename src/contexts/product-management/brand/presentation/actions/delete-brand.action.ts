'use server';
import { TypeOrmBrandRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { DeleteBrandUseCase } from '../../application/use-cases/delete-brand.use-case';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { Result } from '@/shared/features/result';
import { revalidatePath } from 'next/cache';

export async function deleteBrandAction(brandId: bigint) {

  try {
    // Inyeccion de las dependencias usando Factory
    const categoryRepo = await TypeOrmBrandRepository.create();
    const useCase = new DeleteBrandUseCase(categoryRepo);

    const result = await useCase.execute(brandId);
    revalidatePath('/products/list');
    return {
      ...Result.success(result)
    }
  } catch (error) {
    console.error('deleteBrandAction: ', error);
    return {
      ...handleError(error, 'deleteBrandAction')
    };
  }
}
