import { ProductRepository } from "../../domain/repositories/product.repository";
import { LotRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot.repository";
import { SaleDetailRepository } from "src/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductNotFoundException } from "../../domain/exceptions/product-not-found.exception";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";

/**
 * Recalcula el costo promedio móvil (Product.averageCost) de un producto desde cero, simulando
 * un consumo FIFO sobre el histórico completo de lotes y ventas completadas.
 *
 * Es el corazón compartido de:
 * - El botón "Recalcular costo" (presentation/actions/recalculate-product-average-cost.action.ts).
 * - El script de backfill (configuration/databases/typeorm/scripts/backfill-average-cost.ts).
 *
 * No usa FIFO por trazabilidad de lote específico: solo se usa para determinar qué remanente
 * de compra (y a qué precio) compone el stock actual, con fines de costeo, no de auditoría por lote.
 */
export class RecalculateProductAverageCostUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly lotRepository: LotRepository,
        private readonly saleDetailRepository: SaleDetailRepository,
    ) { }

    async execute(productId: bigint): Promise<ProductEntity> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundException('El producto que buscas no existe');
        }

        const newAverageCost = await this.calculate(productId);

        return this.productRepository.updateAverageCost(productId, newAverageCost);
    }

    /**
     * Calcula (sin persistir) el costo promedio móvil que le correspondería a un producto hoy.
     * Expuesto por separado de execute() para permitir una previsualización de solo lectura
     * (p.ej. el modo --dry-run del script de backfill) sin duplicar la lógica FIFO.
     */
    async calculate(productId: bigint): Promise<number> {
        const [lots, saleDetails] = await Promise.all([
            this.lotRepository.findAllByProductId(productId),
            this.saleDetailRepository.findAllByProductId(productId),
        ]);

        return this.calculateAverageCostFromFifoRemnants(lots, saleDetails);
    }

    /**
     * Simula consumo FIFO: resta el total histórico vendido de los lotes más antiguos hacia
     * adelante hasta agotarlo. Lo que "sobra" sin consumir en los lotes restantes es, por
     * definición, el stock actual. El nuevo averageCost es el promedio ponderado de esos remanentes.
     * Si no hay lotes o no queda remanente (todo se vendió/no hay stock), retorna 0.
     */
    private calculateAverageCostFromFifoRemnants(
        lots: LotEntity[],
        saleDetails: { quantity: number }[],
    ): number {
        const lotsAsc = [...lots].sort((a, b) => a.receivedDate.getTime() - b.receivedDate.getTime());
        let remainingToConsume = saleDetails.reduce((acc, detail) => acc + detail.quantity, 0);

        let remnantTotalQuantity = 0;
        let remnantTotalCost = 0;

        for (const lot of lotsAsc) {
            if (remainingToConsume >= lot.initialQuantity) {
                remainingToConsume -= lot.initialQuantity;
                continue;
            }

            const remnantQuantity = lot.initialQuantity - remainingToConsume;
            remainingToConsume = 0;

            remnantTotalQuantity += remnantQuantity;
            remnantTotalCost += remnantQuantity * lot.purchasePrice;
        }

        return remnantTotalQuantity > 0 ? remnantTotalCost / remnantTotalQuantity : 0;
    }
}
