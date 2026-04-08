'use server';
import { revalidatePath } from 'next/cache';
import { UpdateBrandDto } from '../../application/dtos/update-brand.dto';
import { TypeOrmBrandRepository } from '../../infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { UpdateBrandUseCase } from '../../application/use-cases/update-brand.use-case';
import { Result } from '@/shared/lib/utils/result';
import { BrandMapper } from '../../application/mappers/brand.mapper';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

export async function updateBrandAction(updateBrandDTO: UpdateBrandDto) {
  try {
          // Inyeccion de las dependencias usando Factory
          const categoryRepo = await TypeOrmBrandRepository.create();
          const useCase = new UpdateBrandUseCase(categoryRepo);
  
          const result = await useCase.execute(updateBrandDTO);
  
          revalidatePath('/products/list');
  
          return {
              ...Result.success(BrandMapper.toIResponse(result))
          };
      } catch (error) {
          console.error('updateBrandAction: ', error);
          return {
              ...handleError(error, 'updateBrandAction')
          };
      }
}
