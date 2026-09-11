'use server'
import { revalidatePath } from 'next/cache';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { TypeOrmLotRepository } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository';
import { TypeormSaleDetailRepository } from 'src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository';
import { RecalculateProductAverageCostUseCase } from '../../application/use-cases/recalculate-product-average-cost.use-case';
import { Result } from '@/shared/lib/utils/result';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';
import { errorHandler } from '@/shared/infrastructure/error/errorHandler';
import { ProductMapper } from '../../application/mappers/product.mapper';

export async function recalculateProductAverageCostAction(productId: bigint) {
    try {
        const productRepository = await TypeOrmProductRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const saleDetailRepository = await TypeormSaleDetailRepository.create();

        const useCase = new RecalculateProductAverageCostUseCase(productRepository, lotRepository, saleDetailRepository);

        const result = await useCase.execute(productId);

        revalidatePath('/products');

        return {
            ...Result.success(ProductMapper.toIResponse(result))
        };
    } catch (error: any) {
        console.error('recalculateProductAverageCostAction: ', error);
        return {
            ...errorHandler<ErrorEntity>(error, 'recalculateProductAverageCostAction')
        };
    }
}
