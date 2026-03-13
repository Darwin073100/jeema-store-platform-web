import { ProductRepository } from '../../domain/repositories/product.repository';
import { RegisterProductDto } from '../dtos/register-product.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductNameVO } from '../../domain/value-objects/product-name.vo';
import { ProductDescriptionVO } from '../../domain/value-objects/product-description.vo';
import { ProductSkuVO } from '../../domain/value-objects/product-sku.vo';
import { ProductUniversalBarCodeVO } from '../../domain/value-objects/product-universal-bar-code.vo';
import { ForSaleEnum } from '../../../../../shared/domain/enums/for-sale.enum';
import { ProductAlreadyExistsException } from '../../domain/exceptions/product-already-exists.exception';
import { CategoryCheckerPort } from 'src/contexts/product-management/category/domain/ports/out/category-checker.port';
import { BrandChekerPort } from 'src/contexts/product-management/brand/domain/ports/out/brand-checker.port';
import { SeasonCheckerPort } from 'src/contexts/product-management/season/domain/ports/out/season-checker.port';
import { EstablishmentCheckerPort } from 'src/contexts/establishment-management/establishment/application/ports/out/establishment-checker.port';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import {v4 as uuid} from 'uuid';
import { UpdateProductDto } from '../dtos/update-product.dto';

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryChecker: CategoryCheckerPort,
        private readonly brandChecker: BrandChekerPort,
        private readonly seasonChecker: SeasonCheckerPort,
        private readonly establishmentChecker: EstablishmentCheckerPort, 
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
                throw ProductAlreadyExistsException.forUniversalBarCode(dto.establishmentId, dto.universalBarCode);
            }
        }

        if(dto.brandId) {
            // Validar existencia de la marca
            const brandExists = await this.brandChecker.exists(dto.brandId);
            if (!brandExists) {
                throw new ProductNotFoundException(`La marca a la que deseas asignar el producto no existe.`);
            }
        }

        if(dto.seasonId) {
            // Validar existencia de la temporada
            const seasonExists = await this.seasonChecker.exists(dto.seasonId);
            if (!seasonExists) {
                throw new ProductNotFoundException(`La temporada a la que deseas asignar el producto no existe.`);
            }
        }

        if(dto.establishmentId){
            const establishmentExists = await this.establishmentChecker.exists(dto.establishmentId);
            if(!establishmentExists){
                throw new ProductNotFoundException(`El establecimiento al que deseas asignar el producto no existe.`);
            }
        }

        if(dto.categoryId){
            const categoryExists = await this.categoryChecker.exists(dto.categoryId);
            if(!categoryExists){
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
