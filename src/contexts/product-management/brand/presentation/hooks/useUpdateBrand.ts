import { UpdateBrandDto } from '@/contexts/product-management/brand/application/dtos/update-brand.dto';
import { updateBrandAction } from '@/contexts/product-management/brand/presentation/actions/update-brand.action';
import { useState } from 'react';

export function useUpdateBrand() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBrand = async (updateBrandDTO: UpdateBrandDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await updateBrandAction(updateBrandDTO);

      if (!result.ok) {
        setError(result.error?.message[0] || 'Error updating brand');
        return false;
      }

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBrand,
    isLoading,
    error,
  };
}
