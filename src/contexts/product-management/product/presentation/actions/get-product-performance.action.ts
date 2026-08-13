'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { TypeormSaleDetailRepository } from 'src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository';
import { TypeOrmLotRepository } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository';
import { GetProductPerformanceUseCase } from '../../application/use-cases/get-product-performance.use-case';
import { IProductPerformance } from '../interfaces/IProductPerformance';

export async function getProductPerformanceAction(
    productId: bigint,
    dateInit?: Date,
    dateFinish?: Date,
): Promise<IProductPerformance | null> {
    try {
        noStore();

        const productRepository = await TypeOrmProductRepository.create();
        const saleDetailRepository = await TypeormSaleDetailRepository.create();
        const lotRepository = await TypeOrmLotRepository.create();
        const useCase = new GetProductPerformanceUseCase(productRepository, saleDetailRepository, lotRepository);

        return await useCase.execute(productId, dateInit, dateFinish);
    } catch (error) {
        console.log(error);
        return null;
    }
}
