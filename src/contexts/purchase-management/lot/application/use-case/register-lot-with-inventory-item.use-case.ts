import { LotRepository } from "../../domain/repositories/lot.repository";
import { RegisterLotDto } from "../dtos/register-lot.dto";
import { LotEntity } from "../../domain/entities/lot.entity";
import { AddInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";
import { ProductRepository } from "@/contexts/product-management/product/domain/repositories/product.repository";
import { InventoryRepository } from "@/contexts/inventory-management/inventory/domain/repositories/inventory.repository";

export class RegisterLotWithInventoryItemUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly addInventoryItemUseCase: AddInventoryItemUseCase,
        private readonly productRepository: ProductRepository,
        private readonly inventoryRepository: InventoryRepository,
    ) { }

    async execute(dto: RegisterLotDto, itemId: bigint) {
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
            null,
            null
        );
        const result = await this.lotRepository.save(lot);

        if (itemId !== BigInt(0)) {
            // NOTA: se recalcula el promedio móvil ANTES de sumar la cantidad comprada al
            // inventario, para leer el stock actual (previo a esta compra) tal como lo pide la
            // fórmula del promedio ponderado.
            await this.updateAverageCostOnPurchase(dto);
            await this.addInventoryItemUseCase.execute(itemId, dto.initialQuantity);
        }

        return result;
    }

    /**
     * Actualiza Product.averageCost (costo promedio móvil) de forma incremental al comprar un
     * lote: nuevoPromedio = (stockActual * promedioActual + cantidadComprada * precioCompra) /
     * (stockActual + cantidadComprada). El stock actual se suma en todas las sucursales, porque
     * Lot es global por producto (no tiene branchOfficeId) — mismo alcance que el promedio.
     *
     * Nota de concurrencia (documentada en el plan, no resuelta aquí): una compra simultánea del
     * mismo producto en dos sucursales a la vez podría generar una condición de carrera en este
     * read-modify-write. Bajo riesgo dado el volumen típico de un POS de tienda.
     */
    private async updateAverageCostOnPurchase(dto: RegisterLotDto): Promise<void> {
        const [product, inventories] = await Promise.all([
            this.productRepository.findById(dto.productId),
            this.inventoryRepository.findAllByProductId(dto.productId),
        ]);

        if (!product) return;

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