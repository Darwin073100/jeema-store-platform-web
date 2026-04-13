import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductNameVO } from '../../domain/value-objects/product-name.vo';
import { ProductDescriptionVO } from '../../domain/value-objects/product-description.vo';
import { ProductSkuVO } from '../../domain/value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '../../domain/value-objects/product-universal-bar-code.vo';
import { ForSaleEnum } from '../../../../../shared/domain/enums/for-sale.enum';
import { ProductAlreadyExistsException } from '../../domain/exceptions/product-already-exists.exception';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { v4 as uuid } from 'uuid';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { EstablishmentRepository } from '@/contexts/establishment-management/establishment/domain/repositories/establishment.repository';
import { CategoryRepository } from '@/contexts/product-management/category/domain/repositories/category.repository';
import { BrandRepository } from '@/contexts/product-management/brand/domain/repositories/brand.repository';
import { SeasonRepository } from '@/contexts/product-management/season/domain/repositories/season.repository';


export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryChecker: CategoryRepository,
        private readonly brandChecker: BrandRepository,
        private readonly seasonChecker: SeasonRepository,
        private readonly establishmentChecker: EstablishmentRepository,
    ) { }

    async execute(dto: UpdateProductDto): Promise<ProductEntity> {
        // Validar unicidad SKU
        if (dto.sku) {
            const existingBySku = await this.productRepository.findByEstablishmentAndSku(dto.establishmentId, dto.sku);
            if (existingBySku) {
                throw ProductAlreadyExistsException.forSku(dto.establishmentId, dto.sku);
            }
        }
        // Validar unicidad universalBarCode
        if (dto.universalBarCode) {
            const existingByBarCode = await this.productRepository.findByEstablishmentAndUniversalBarCode(dto.establishmentId, dto.universalBarCode);
            if (existingByBarCode) {
                if (
                    existingByBarCode.universalBarCode.value?.trim().toUpperCase() === dto.universalBarCode.trim().toUpperCase() &&
                    existingByBarCode.productId != dto.productId
                ) {
                    throw ProductAlreadyExistsException.forUniversalBarCode(dto.establishmentId, dto.universalBarCode);
                }
            }
        }

        if (dto.brandId) {
            // Validar existencia de la marca
            const brandExists = await this.brandChecker.existById(dto.brandId);
            if (!brandExists) {
                throw new ProductNotFoundException(`La marca a la que deseas asignar el producto no existe.`);
            }
        }

        if (dto.seasonId) {
            // Validar existencia de la temporada
            const seasonExists = await this.seasonChecker.existById(dto.seasonId);
            if (!seasonExists) {
                throw new ProductNotFoundException(`La temporada a la que deseas asignar el producto no existe.`);
            }
        }

        if (dto.establishmentId) {
            const establishmentExists = await this.establishmentChecker.existById(dto.establishmentId);
            if (!establishmentExists) {
                throw new ProductNotFoundException(`El establecimiento al que deseas asignar el producto no existe.`);
            }
        }

        if (dto.categoryId) {
            const categoryExists = await this.categoryChecker.existById(dto.categoryId);
            if (!categoryExists) {
                throw new ProductNotFoundException(`La categoría a la que deseas asignar el producto no existe.`);
            }
        }
        // Crear entidad
        const product = ProductEntity.create(
            dto.productId,
            dto.establishmentId,
            dto.categoryId,
            dto.brandId ?? null,
            dto.seasonId ?? null,
            new ProductNameVO(dto.name),
            new ProductSkuVO(uuid()),
            new ProductUniversalBarCodeVO(dto.universalBarCode ?? null),
            new ProductDescriptionVO(dto.description ?? null),
            dto.unitOfMeasure as ForSaleEnum,
            dto.minStockGlobal,
            dto.imageUrl ?? null
        );
        return this.productRepository.save(product);
    }
}
