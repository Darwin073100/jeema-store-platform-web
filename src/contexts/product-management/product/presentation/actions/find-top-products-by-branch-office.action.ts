'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { number, object, string } from 'yup';
import { FilterTopRequestDTO } from '../../application/dtos/filter-top.dto';
import { TopProductsResponseDto } from '../../application/dtos/products-top-by-branch-office-response.dto';
import { FindTopProductsByBranchOfficeUseCase, TOP_PRODUCTS_MAX_LIMIT } from '../../application/use-cases/find-top-products-by-branch-office.use-case';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { requireSession } from '@/shared/infrastructure/auth/require-session';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { Result } from '@/shared/lib/utils/result';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';

/** Roles que pueden ver el top de productos en el inicio. */
const TOP_PRODUCTS_ROLES = ['global_admin', 'establishment_manager', 'branch_office_management'];

const emptyToNull = (value: unknown, original: unknown) => (original === '' ? null : value);

const schema = object({
    limit: number().integer().min(1).max(TOP_PRODUCTS_MAX_LIMIT).optional(),
    categoryId: string().transform(emptyToNull).matches(/^\d+$/, 'Categoría inválida').nullable().optional(),
    month: string().transform(emptyToNull).matches(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mes inválido').nullable().optional(),
    dateInit: string().transform(emptyToNull).matches(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de inicio inválida').nullable().optional(),
    dateFinish: string().transform(emptyToNull).matches(/^\d{4}-\d{2}-\d{2}$/, 'Fecha límite inválida').nullable().optional(),
});

/**
 * Top de productos más vendidos (por volumen y por monto) de la sucursal activa.
 */
export async function findTopProductsByBranchOfficeAction(filter: FilterTopRequestDTO = {}): Promise<{
    ok: boolean;
    value?: TopProductsResponseDto;
    error?: ErrorEntity;
}> {
    noStore(); // Evitar que se cachée este server action
    try {
        await requireSession({ roles: TOP_PRODUCTS_ROLES });
        const dto = await schema.validate(filter, { stripUnknown: true });

        const cookieStore = await cookies();
        const branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOffice ? BigInt((JSON.parse(branchOffice) as IBranchOffice).branchOfficeId) : BigInt(0);

        const useCase = new FindTopProductsByBranchOfficeUseCase(await TypeOrmProductRepository.create());
        const result = await useCase.execute(branchOfficeId, dto);
        return { ...Result.success(result) };
    } catch (error) {
        return { ...handleError(error, 'findTopProductsByBranchOfficeAction') };
    }
}
