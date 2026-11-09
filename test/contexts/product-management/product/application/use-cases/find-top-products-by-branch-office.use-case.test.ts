/** @jest-environment node */
import { FindTopProductsByBranchOfficeUseCase } from '@/contexts/product-management/product/application/use-cases/find-top-products-by-branch-office.use-case';
import { ProductRepository } from '@/contexts/product-management/product/domain/repositories/product.repository';
import { FilterTopEnum } from '@/contexts/product-management/product/domain/enums/FilterTopEnum';
import { TopSellingProductsCriteria } from '@/contexts/product-management/product/domain/read-models/top-selling-product.read-model';
import { InvalidSalesPeriodException } from '@/contexts/product-management/product/domain/exceptions/invalid-sales-period.exception';

const BRANCH_OFFICE_ID = BigInt(7);

const buildUseCase = () => {
    const findTopSellingByBranchOffice = jest.fn(async (_branchOfficeId: bigint, criteria: TopSellingProductsCriteria) => [
        { productId: BigInt(1), name: criteria.orderBy, categoryName: null, quantitySales: 1, totalSales: 1 },
    ]);
    const repository = { findTopSellingByBranchOffice } as unknown as ProductRepository;
    return { useCase: new FindTopProductsByBranchOfficeUseCase(repository), findTopSellingByBranchOffice };
};

const criteriaOf = (mock: jest.Mock, call = 0) => mock.mock.calls[call][1] as TopSellingProductsCriteria;

describe('FindTopProductsByBranchOfficeUseCase', () => {
    afterEach(() => jest.useRealTimers());

    it('por defecto consulta el mes actual, todas las categorías y el top 10, en ambos órdenes', async () => {
        jest.useFakeTimers({ now: new Date(2026, 10, 15, 12) });
        const { useCase, findTopSellingByBranchOffice } = buildUseCase();

        const result = await useCase.execute(BRANCH_OFFICE_ID, {});

        expect(findTopSellingByBranchOffice).toHaveBeenCalledTimes(2);
        expect(findTopSellingByBranchOffice.mock.calls.map(call => call[1].orderBy))
            .toEqual([FilterTopEnum.QUANTITY_SALES, FilterTopEnum.TOTAL_SALES]);
        expect(criteriaOf(findTopSellingByBranchOffice)).toMatchObject({ categoryId: null, limit: 10 });
        expect(result.dateInit).toBe('2026-11-01');
        expect(result.dateFinish).toBe('2026-11-30');
        expect(result.byQuantity[0].name).toBe(FilterTopEnum.QUANTITY_SALES);
        expect(result.byTotal[0].name).toBe(FilterTopEnum.TOTAL_SALES);
    });

    it('consulta el mes indicado con fin exclusivo (agosto → 1 sep)', async () => {
        const { useCase, findTopSellingByBranchOffice } = buildUseCase();

        const result = await useCase.execute(BRANCH_OFFICE_ID, { month: '2026-08', categoryId: '3', limit: 100 });

        const criteria = criteriaOf(findTopSellingByBranchOffice);
        expect(criteria.dateInit).toEqual(new Date(2026, 7, 1));
        expect(criteria.dateFinish).toEqual(new Date(2026, 8, 1));
        expect(criteria.categoryId).toBe(BigInt(3));
        expect(criteria.limit).toBe(100);
        expect(result).toMatchObject({ dateInit: '2026-08-01', dateFinish: '2026-08-31' });
    });

    it('el rango tiene prioridad sobre el mes e incluye el día final completo', async () => {
        const { useCase, findTopSellingByBranchOffice } = buildUseCase();

        const result = await useCase.execute(BRANCH_OFFICE_ID, {
            month: '2026-01', dateInit: '2026-08-10', dateFinish: '2026-08-20',
        });

        const criteria = criteriaOf(findTopSellingByBranchOffice);
        expect(criteria.dateInit).toEqual(new Date(2026, 7, 10));
        expect(criteria.dateFinish).toEqual(new Date(2026, 7, 21));
        expect(result).toMatchObject({ dateInit: '2026-08-10', dateFinish: '2026-08-20' });
    });

    it('acota el límite entre 1 y 100', async () => {
        const { useCase, findTopSellingByBranchOffice } = buildUseCase();

        await useCase.execute(BRANCH_OFFICE_ID, { limit: 5000 });
        await useCase.execute(BRANCH_OFFICE_ID, { limit: 0 });

        expect(criteriaOf(findTopSellingByBranchOffice, 0).limit).toBe(100);
        expect(criteriaOf(findTopSellingByBranchOffice, 2).limit).toBe(1);
    });

    it('rechaza un rango con inicio posterior al fin', async () => {
        const { useCase, findTopSellingByBranchOffice } = buildUseCase();

        await expect(useCase.execute(BRANCH_OFFICE_ID, { dateInit: '2026-08-20', dateFinish: '2026-08-10' }))
            .rejects.toBeInstanceOf(InvalidSalesPeriodException);
        expect(findTopSellingByBranchOffice).not.toHaveBeenCalled();
    });
});
