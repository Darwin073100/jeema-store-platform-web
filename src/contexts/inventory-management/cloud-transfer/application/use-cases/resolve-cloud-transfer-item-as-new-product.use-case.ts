import { v4 as uuid } from "uuid";
import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { CategoryRepository } from "src/contexts/product-management/category/domain/repositories/category.repository";
import { BrandRepository } from "src/contexts/product-management/brand/domain/repositories/brand.repository";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { ProductNameVO } from "src/contexts/product-management/product/domain/value-objects/product-name.vo";
import { ProductSkuVO } from "src/contexts/product-management/product/domain/value-objects/product-sku.vo";
import { ProductUniversalBarCodeVO } from "src/contexts/product-management/product/domain/value-objects/product-universal-bar-code.vo";
import { ProductDescriptionVO } from "src/contexts/product-management/product/domain/value-objects/product-description.vo";
import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";
import { InventoryInternalBarCodeVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-internal-bar-code.vo";
import { InventorySalePriceOneVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-one.vo";
import { InventorySalePriceManyVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-many.vo";
import { InventorySaleQuantityManyVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-quantity-many.vo";
import { InventorySalePriceSpecialVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-sale-price-special.vo";
import { InventoryMinStockBranchVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-min-stock-branch.vo";
import { InventoryMaxStockBranchVO } from "src/contexts/inventory-management/inventory/domain/value-objects/inventory-max-stock-branch.vo";
import { ResolveCloudTransferItemAsNewProductDto } from "../dtos/resolve-cloud-transfer-item-as-new-product.dto";
import { CloudTransferItemNotFoundException } from "../../domain/exceptions/cloud-transfer-item-not-found.exception";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";

/**
 * Crea `Product` + `Inventory` (sin lote, sin `inventory_item`, stock en cero) reutilizando el mismo camino
 * que `RegisterCompleteProductUseCase`/`productRepository.saveCompleteProduct` ya usa hoy para crear
 * producto+inventario juntos (con `lot = undefined`, ya que el lote se crea recién en `approve()`). Ver
 * spect/08_cloud_transfer_spect.md sección 5.9.
 */
export class ResolveCloudTransferItemAsNewProductUseCase {
    constructor(
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly brandRepository: BrandRepository,
        private readonly inventoryRepository: InventoryRepository,
    ) { }

    async execute(dto: ResolveCloudTransferItemAsNewProductDto): Promise<CloudTransferItemEntity> {
        const item = await this.cloudTransferItemRepository.findById(dto.cloudTransferItemId);
        if (!item) {
            throw new CloudTransferItemNotFoundException(`No se encontró el item de traspaso (${dto.cloudTransferItemId}).`);
        }

        const category = await this.categoryRepository.existById(dto.localCategoryId);
        if (!category) {
            throw new CloudTransferItemNotFoundException(`La categoría local (${dto.localCategoryId}) no existe.`);
        }
        if (dto.localBrandId) {
            const brand = await this.brandRepository.existById(dto.localBrandId);
            if (!brand) {
                throw new CloudTransferItemNotFoundException(`La marca local (${dto.localBrandId}) no existe.`);
            }
        }

        const inventoryEntity = InventoryEntity.reconstitute(
            BigInt(0),
            BigInt(0),
            dto.branchOfficeId,
            true,
            new Date(),
            InventoryInternalBarCodeVO.create(dto.internalBarCode ?? null),
            InventorySalePriceOneVO.create(dto.salePriceOne ?? item.inventorySuggestedSalePriceOne),
            InventorySalePriceManyVO.create(dto.salePriceMany ?? item.inventorySuggestedSalePriceMany),
            InventorySaleQuantityManyVO.create(dto.saleQuantityMany ?? item.inventorySuggestedSaleQuantityMany),
            InventorySalePriceSpecialVO.create(dto.salePriceSpecial ?? item.inventorySuggestedSalePriceSpecial),
            InventoryMinStockBranchVO.create(dto.minStockBranch ?? null),
            InventoryMaxStockBranchVO.create(dto.maxStockBranch ?? null),
            null,
            null,
            null,
            undefined,
            null,
            null,
            null,
        );

        const productEntity = ProductEntity.reconstitute(
            BigInt(0),
            dto.establishmentId,
            dto.localCategoryId,
            dto.localBrandId ?? null,
            null,
            new ProductNameVO(item.productName),
            new ProductSkuVO(uuid()),
            new ProductUniversalBarCodeVO(item.productUniversalBarCode),
            new ProductDescriptionVO(item.productDescription),
            item.productUnitOfMeasure,
            null,
            item.productImageUrl,
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null,
            undefined, // sin lote: se crea recién en approve()
            inventoryEntity,
        );

        const savedProduct = await this.productRepository.saveCompleteProduct(productEntity);

        // `saveCompleteProduct` retorna el producto, sin garantizar el inventario recién creado embebido —
        // se recarga explícitamente para obtener su id.
        const createdInventories = await this.inventoryRepository.findAllByProductId(savedProduct.productId);
        const createdInventory = createdInventories.find(inv => inv.branchOfficeId === dto.branchOfficeId) ?? createdInventories[0];
        if (!createdInventory) {
            throw new InvalidCloudTransferException('No se pudo crear el inventario del producto nuevo.');
        }

        item.resolveAsNewProduct(savedProduct.productId, dto.localCategoryId, createdInventory.inventoryId);
        return this.cloudTransferItemRepository.save(item);
    }
}
