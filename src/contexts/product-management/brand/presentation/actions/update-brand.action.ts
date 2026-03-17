'use server';

import { revalidatePath } from 'next/cache';
import { UpdateBrandUseCase } from '../application/update-brand.use-case';
import { BrandRepositoryFactory } from '../infraestructure/factories/brand-repository.factory';
import { UpdateBrandDTO } from '../application/dtos/update-brand.dto';

export async function updateBrandAction(updateBrandDTO: UpdateBrandDTO) {
  try {
    const brandRepository = BrandRepositoryFactory.create();
    const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
    
    const result = await updateBrandUseCase.execute(updateBrandDTO);
    
    if (!result.ok) {
      return {
        success: false,
        error: result.error?.message || 'Error updating brand'
      };
    }

    revalidatePath('/(platform)/brands');
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateBrandAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error updating brand'
    };
  }
}
