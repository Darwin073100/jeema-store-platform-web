'use server'
import { revalidatePath } from 'next/cache';
import { UpdateProductDto } from '../../application/dtos/update-product.dto';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { TypeormCategoryRepository } from '@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository';
import { TypeOrmBrandRepository } from '@/contexts/product-management/brand/infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { TypeormSeasonRepository } from '@/contexts/product-management/season/infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { TypeOrmEstablishmentRepository } from '@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository';
import { ErrorEntity } from '@/shared/lib/utils/error.entity';
import { errorHandler } from '@/shared/infrastructure/error/errorHandler';
import { Result } from '@/shared/lib/utils/result';
import { ProductMapper } from '../../application/mappers/product.mapper';
import { cookies } from 'next/headers';
import { IEstablishment } from '@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment';

export async function updateProductAction(dto: UpdateProductDto) {
    try {
        const productRepo = await TypeOrmProductRepository.create();
        const categoryRepo = await TypeormCategoryRepository.create();
        const brandRepo = await TypeOrmBrandRepository.create();
        const seasonRepo = await TypeormSeasonRepository.create();
        const establishmentRepo = await TypeOrmEstablishmentRepository.create();

        const cookieStore = await cookies();       
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as IEstablishment).establishmentId;
        }

        const useCase = new UpdateProductUseCase(productRepo, categoryRepo, brandRepo, seasonRepo, establishmentRepo);

        const result = await useCase.execute({
            ...dto,
            establishmentId
        });

        // Invalidar el caché de la página de productos para que se actualicen los datos
        if (result) {
            revalidatePath('/products');
        }

        return {
            ...Result.success(ProductMapper.toIResponse(result))
        }
    } catch (error: any) {
        console.error('deleteProductAction: ',error);
        return {
            ...errorHandler<ErrorEntity>(error, 'deleteProductAction')
        };
    }
}