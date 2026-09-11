import { LotEntity } from "../../domain/entities/lot.entity";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { PurchasePriceVO } from "../../domain/value-objects/purchase-price.vo";
import { RegisterLotDto } from "../dtos/register-lot.dto";
import { ProductNotFoundException } from "src/contexts/product-management/product/domain/exceptions/product-not-found.exception";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";
import { LotUnitPurchaseEntity } from "../../domain/entities/lot-unit-purchase.entity";
import { LotPurchaseQuantityVO } from "../../domain/value-objects/lot-purchase-quantity.vo";
import { LotUnitsInPurchaseUnitVO } from "../../domain/value-objects/lot-units-in-purchase-unit.vo";
import { ProductRepository } from "@/contexts/product-management/product/domain/repositories/product.repository";
import { InventoryRepository } from "@/contexts/inventory-management/inventory/domain/repositories/inventory.repository";

export class RegisterLotUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly productRepository: ProductRepository,
        private readonly inventoryRepository: InventoryRepository,
    ) { }

    async execute(dto: RegisterLotDto): Promise<LotEntity> {
        // Validar que el producto existe
        const productExists = await this.productRepository.existById(dto.productId);

        if (!productExists) {
            throw new ProductNotFoundException(`El producto con ID ${dto.productId} no existe.`);
        }

        const lot = LotEntity.reconstitute(
            BigInt(0),
            dto.productId,
            dto.suplierId,
            dto.lotNumber,
            dto.purchasePrice,
            dto.initialQuantity,
            dto.purchaseUnit,
            dto.receivedDate,
            dto.expirationDate,
            dto.manufacturingDate,
            new Date(),
            null,
            null,
            null,
            dto.lotUnitPurchases? dto.lotUnitPurchases?.map(item => {
                return LotUnitPurchaseEntity.create(
                    BigInt(new Date().getTime()),
                    PurchasePriceVO.create(item.purchasePrice),
                    LotPurchaseQuantityVO.create(item.purchaseQuantity),
                    item.unit,
                    LotUnitsInPurchaseUnitVO.create(item.unitsInPurchaseUnit)
                )
            }): null,
            null
        );


        const result = await this.lotRepository.saveWithItems(lot);

        // Mantenimiento incremental del costo promedio móvil, mismo hook que
        // RegisterLotWithInventoryItemUseCase: este flujo también representa una compra de lote.
        await this.updateAverageCostOnPurchase(dto, productExists);

        return result;
    }

    /**
     * Actualiza Product.averageCost (costo promedio móvil) de forma incremental al comprar un
     * lote: nuevoPromedio = (stockActual * promedioActual + cantidadComprada * precioCompra) /
     * (stockActual + cantidadComprada). El stock actual se suma en todas las sucursales, porque
     * Lot es global por producto (no tiene branchOfficeId) — mismo alcance que el promedio.
     */
    private async updateAverageCostOnPurchase(dto: RegisterLotDto, product: ProductEntity | null): Promise<void> {
        if (!product) return;

        const inventories = await this.inventoryRepository.findAllByProductId(dto.productId);
        const currentStock = inventories.reduce((acc, inventory) => {
            const inventoryStock = (inventory.inventoryItems ?? []).reduce(
                (sum, item) => sum + item.quantityOnHand.value,
                0,
            );
            return acc + inventoryStock;
        }, 0);

        const totalStockAfterPurchase = currentStock + dto.initialQuantity;
        const newAverageCost = totalStockAfterPurchase > 0
            ? ((currentStock * product.averageCost) + (dto.initialQuantity * dto.purchasePrice)) / totalStockAfterPurchase
            : 0;

        await this.productRepository.updateAverageCost(dto.productId, newAverageCost);
    }
}