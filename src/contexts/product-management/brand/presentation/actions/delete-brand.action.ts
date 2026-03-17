'use server';

import { revalidatePath } from 'next/cache';
import { DeleteBrandUseCase } from '../application/delete-brand.use-case';
import { BrandRepositoryFactory } from '../infraestructure/factories/brand-repository.factory';

export async function deleteBrandAction(brandId: string) {
  try {
    const brandRepository = BrandRepositoryFactory.create();
    const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
    
    const result = await deleteBrandUseCase.execute(brandId);
    
    if (!result.ok) {
      return {
        success: false,
        error: result.error?.message || 'Error deleting brand'
      };
    }

    revalidatePath('/(platform)/brands');
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteBrandAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error deleting brand'
    };
  }
}
