import { revalidatePath } from 'next/cache';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';

/**
 * Invalida el caché de las páginas que muestran la imagen principal de cada
 * tipo de dueño, replicando las rutas ya usadas por las Server Actions
 * propias de cada contexto (producto, empleado, establecimiento).
 */
export function revalidateOwnerPaths(ownerType: ImageOwnerType): void {
  switch (ownerType) {
    case ImageOwnerType.PRODUCT:
      revalidatePath('/products');
      break;
    case ImageOwnerType.EMPLOYEE:
      revalidatePath('/configurations/employees');
      revalidatePath('/configurations/users');
      break;
    case ImageOwnerType.ESTABLISHMENT:
      revalidatePath('/configurations/establishment');
      break;
  }
}
