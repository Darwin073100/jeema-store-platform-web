import { v4 as uuid } from 'uuid'
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { InventoryEntity } from "../../../../inventory-management/inventory/domain/entities/inventory.entity";
import { InventoryMaxStockBranchVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-max-stock-branch.vo";
import { InventoryMinStockBranchVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-min-stock-branch.vo";
import { InventorySalePriceManyVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-sale-price-many.vo";
import { InventorySalePriceOneVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceSpecialVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-sale-price-special.vo";
import { InventorySaleQuantityManyVO } from "../../../../inventory-management/inventory/domain/value-objects/inventory-sale-quantity-many.vo";
import { ProductNameVO } from "src/contexts/product-management/product/domain/value-objects/product-name.vo";
import { ProductSkuVO } from "src/contexts/product-management/product/domain/value-objects/product-sku.vo";
import { ProductUniversalBarCodeVO } from "src/contexts/product-management/product/domain/value-objects/product-universal-bar-code.vo";
import { ProductDescriptionVO } from "src/contexts/product-management/product/domain/value-objects/product-description.vo";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";
import { PurchasePriceVO } from "src/contexts/purchase-management/lot/domain/value-objects/purchase-price.vo";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductNotFoundException } from "../../domain/exceptions/product-not-found.exception";
import { ProductAlreadyExistsException } from "../../domain/exceptions/product-already-exists.exception";
import { CategoryCheckerPort } from "src/contexts/product-management/category/domain/ports/out/category-checker.port";
import { BrandChekerPort } from "src/contexts/product-management/brand/domain/ports/out/brand-checker.port";
import { SeasonCheckerPort } from "src/contexts/product-management/season/domain/ports/out/season-checker.port";
import { LotUnitPurchaseEntity } from "src/contexts/purchase-management/lot/domain/entities/lot-unit-purchase.entity";
import { LotPurchaseQuantityVO } from "src/contexts/purchase-management/lot/domain/value-objects/lot-purchase-quantity.vo";
import { LotUnitsInPurchaseUnitVO } from "src/contexts/purchase-management/lot/domain/value-objects/lot-units-in-purchase-unit.vo";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "src/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo";
import { InventoryInternalBarCodeVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-internal-bar-code.vo";
import { RegisterCompleteProductDto } from "../dtos/register-complete-product.dto";
import { EstablishmentRepository } from '@/contexts/establishment-management/establishment/domain/repositories/establishment.repository';

export class RegisterCompleteProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryChecker: CategoryCheckerPort,
        private readonly brandChecker: BrandChekerPort,
        private readonly seasonChecker: SeasonCheckerPort,
        private readonly establishmentChecker: EstablishmentRepository, 
    ) { }

    async execute(dto: RegisterCompleteProductDto) {
        let inventoryEntity: InventoryEntity | null = null;
        let lotEntity: LotEntity | null = null;
        //* Verificar que exista el establecimiento
        if (dto.establishmentId) {
            const establishmentExists = await this.establishmentChecker.existById(dto.establishmentId);
            if (!establishmentExists) {
                throw new ProductNotFoundException(`El establecimiento al que deseas asignar el producto no existe.`);
            }
        }
        //* Validar unicidad SKU
        if (dto.sku) {
            const existingBySku = await this.productRepository.findByEstablishmentAndSku(dto.establishmentId, dto.sku);
            if (existingBySku) {
                throw ProductAlreadyExistsException.forSku(dto.establishmentId, dto.sku);
            }
        }
        //* Validar unicidad universalBarCode por establecimiento
        if (dto.universalBarCode) {
            const existingByBarCode = await this.productRepository.findByEstablishmentAndUniversalBarCode(dto.establishmentId, dto.universalBarCode);
            if (existingByBarCode) {
                throw ProductAlreadyExistsException.forUniversalBarCode(dto.establishmentId, dto.universalBarCode);
            }
        }

        //* Validar existencia de la marca
        if (dto.brandId) {
            const brandExists = await this.brandChecker.exists(dto.brandId);
            if (!brandExists) {
                throw new ProductNotFoundException(`La marca a la que deseas asignar el producto no existe.`);
            }
        }

        //* Validar existencia de la temporada
        if (dto.seasonId) {
            const seasonExists = await this.seasonChecker.exists(dto.seasonId);
            if (!seasonExists) {
                throw new ProductNotFoundException(`La temporada a la que deseas asignar el producto no existe.`);
            }
        }

        //* Validar existencia de la categoría
        if (dto.categoryId) {
            const categoryExists = await this.categoryChecker.exists(dto.categoryId);
            if (!categoryExists) {
                throw new ProductNotFoundException(`La categoría a la que deseas asignar el producto no existe.`);
            }
        }

        //! Verificar si viene el inventario
        if(dto.inventory){
            inventoryEntity = InventoryEntity.reconstitute(
                BigInt(0),
                BigInt(0),
                dto.inventory.branchOfficeId,
                dto.inventory.isSellable,
                new Date(),
                InventoryInternalBarCodeVO.create(dto.inventory.internalBarCode),
                InventorySalePriceOneVO.create(dto.inventory.salePriceOne),
                InventorySalePriceManyVO.create(dto.inventory.salePriceMany),
                InventorySaleQuantityManyVO.create(dto.inventory.saleQuantityMany),
                InventorySalePriceSpecialVO.create(dto.inventory.salePriceSpecial),
                InventoryMinStockBranchVO.create(dto.inventory.minStockBranch),
                InventoryMaxStockBranchVO.create(dto.inventory.maxStockBranch),
                null, // Product
                null,
                dto.inventory.inventoryItems?.map(item=>{
                    return InventoryItemEntity.reconstitute(
                        BigInt(new Date().getTime()),
                        BigInt(new Date().getTime()),
                        item.location,
                        InventoryItemQuantityOnHandVO.create(item.quantityOnHan),
                        new Date(),
                        null,
                        null,
                        null
                    )
                }),
                undefined,
                null,
                null
            );
        }
        //! Verificar si viene el lote del producto
        if(dto.lot){
            lotEntity = LotEntity.reconstitute(
                BigInt(0),
                BigInt(0),
                dto.lot.suplierId,
                dto.lot.lotNumber,
                dto.lot.purchasePrice,
                dto.lot.initialQuantity,
                dto.lot.purchaseUnit,
                dto.lot.receivedDate,
                dto.lot.expirationDate,
                dto.lot.manufacturingDate,
                new Date(),
                null,
                null,
                null,
                dto.lot.lotUnitPurchases? dto.lot.lotUnitPurchases?.map(item => {
                    return LotUnitPurchaseEntity.create(
                        item.lotId ?? BigInt(0),
                        PurchasePriceVO.create(item.purchasePrice),
                        LotPurchaseQuantityVO.create(item.purchaseQuantity),
                        item.unit,
                        LotUnitsInPurchaseUnitVO.create(item.unitsInPurchaseUnit)
                    )
                }): null,
                null
            );
        }

        //? Creamos la entidad final para persistir en la DB
        const productEntity = ProductEntity.reconstitute(
            BigInt(0),
            dto.establishmentId,
            dto.categoryId,
            dto.brandId ?? null,
            dto.seasonId ?? null,
            new ProductNameVO(dto.name),
            new ProductSkuVO(uuid()),
            new ProductUniversalBarCodeVO(dto.universalBarCode ?? null),
            new ProductDescriptionVO(dto.description ?? null),
            dto.unitOfMeasure,
            dto.minStockGlobal,
            dto.imageUrl ?? null,
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null,
            lotEntity? [lotEntity]: undefined,
            inventoryEntity? inventoryEntity: undefined
        );
        const result = await this.productRepository.saveCompleteProduct(productEntity);
        return result;
    }
}