'use server'
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { EstablishmentEntity } from '@/features/establishment/domain/entities/establishment.entity';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';
import { RegisterCompleteProductDto } from '../../application/dtos/register-complete-product.dto';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { RegisterCompleteProductUseCase } from '../../application/use-cases/register-complete-product.use-case';
import { TypeormCategoryRepository } from '@/contexts/product-management/category/infraestructure/persistence/typeorm/repositories/typeorm-category.repository';
import { TypeOrmBrandRepository } from '@/contexts/product-management/brand/infraestruture/persistence/typeorm/repositories/typeorm-brand.repository';
import { TypeormSeasonRepository } from '@/contexts/product-management/season/infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { TypeOrmEstablishmentRepository } from '@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository';
import { Result } from '@/shared/features/result';
import { ProductMapper } from '../../application/mappers/product.mapper';

export async function registerCompleteProductAction(dto: RegisterCompleteProductDto) {
    try {
        const productRepo = await TypeOrmProductRepository.create();
        const categoryRepo = await TypeormCategoryRepository.create();
        const brandRepo = await TypeOrmBrandRepository.create();
        const seasonRepo = await TypeormSeasonRepository.create();
        const establishmentRepo = await TypeOrmEstablishmentRepository.create();

        const useCase = new RegisterCompleteProductUseCase(productRepo, categoryRepo, brandRepo, seasonRepo, establishmentRepo);

        const cookieStore = await cookies();
        let establishment = cookieStore.get('establishmentCookie')?.value ?? null;
        let establishmentId = BigInt(0);
        if (establishment) {
            establishmentId = (JSON.parse(establishment) as EstablishmentEntity).establishmentId;
        }
        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
        }

        const currentDTO: RegisterCompleteProductDto = {
            ...dto,
            establishmentId: establishmentId,
            inventory: dto.inventory ? {
                ...dto.inventory,
                branchOfficeId: branchOfficeId
            } : null
        }

        const result = await useCase.execute(currentDTO);

        // Invalidar el caché de la página de productos para que se actualicen los datos
        if (result) {
            revalidatePath('/products');
        }

        return {
            ...Result.success(ProductMapper.toIResponse(result))
        }
    } catch (error) {
        console.log('registerCompleteProductAction');
        return {
            ...handleError(error,'registerCompleteProductAction')
        }
    }
}