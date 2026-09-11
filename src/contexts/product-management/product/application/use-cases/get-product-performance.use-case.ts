import { ProductRepository } from 'src/contexts/product-management/product/domain/repositories/product.repository';
import { SaleDetailRepository } from 'src/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository';
import { LotRepository } from 'src/contexts/purchase-management/lot/domain/repositories/lot.repository';
import { ProductNotFoundException } from 'src/contexts/product-management/product/domain/exceptions/product-not-found.exception';
import { ProductPerformanceResponseDTO } from '../dtos/product-performance-response.dto';

export class GetProductPerformanceUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly saleDetailRepository: SaleDetailRepository,
        private readonly lotRepository: LotRepository,
    ) { }

    async execute(productId: bigint, dateInit?: Date, dateFinish?: Date): Promise<ProductPerformanceResponseDTO> {
        const [product, saleDetails, lots] = await Promise.all([
            this.productRepository.findById(productId),
            this.saleDetailRepository.findAllByProductId(productId, dateInit, dateFinish),
            this.lotRepository.findAllByProductId(productId, dateInit, dateFinish),
        ]);

        if (!product) {
            throw new ProductNotFoundException('El producto que buscas no existe');
        }

        const unitsSold = saleDetails.reduce((acc, detail) => acc + detail.quantity, 0);
        const grossRevenue = saleDetails.reduce((acc, detail) => acc + detail.subtotalItem, 0);
        const unitsReturned = saleDetails.reduce(
            (acc, detail) => acc + (detail.returns?.reduce((sum, item) => sum + item.quantityReturn, 0) ?? 0),
            0,
        );
        const returnsAmount = saleDetails.reduce(
            (acc, detail) => acc + (detail.returns?.reduce((sum, item) => sum + item.amountReturn, 0) ?? 0),
            0,
        );
        const netUnitsSold = unitsSold - unitsReturned;
        const netRevenue = grossRevenue - returnsAmount;
        const lastSaleDate = saleDetails.reduce<Date | null>((latest, detail) => {
            const saleDate = detail.sale?.createdAt ?? null;
            if (!saleDate) return latest;
            return !latest || saleDate > latest ? saleDate : latest;
        }, null);

        // Panel "Compras": informativo sobre lo comprado en el rango (Lot.purchasePrice/receivedDate).
        // No se usa para estimar el costo de lo vendido (ver más abajo) — eso ahora viene del
        // costo congelado en cada saleDetail.unitCostAtSale, no de promediar lotes en vivo.
        const unitsPurchased = lots.reduce((acc, lot) => acc + lot.initialQuantity, 0);
        const totalCost = lots.reduce((acc, lot) => acc + lot.purchasePrice * lot.initialQuantity, 0);
        const avgUnitCost = unitsPurchased > 0 ? totalCost / unitsPurchased : 0;
        const lastPurchaseDate = lots.reduce<Date | null>((latest, lot) => {
            return !latest || lot.receivedDate > latest ? lot.receivedDate : latest;
        }, null);

        // Costo de lo efectivamente vendido en el rango: se suma quantity * unitCostAtSale ya
        // congelado en cada detalle de venta (snapshot tomado al momento de la venta), en vez de
        // recalcular un promedio en vivo sobre los lotes actuales. Esto corrige el bug de fondo:
        // antes se mezclaba el costo de compras del rango con ventas del mismo rango, aunque no
        // guardaran relación real entre sí, y el monto de una venta ya cerrada podía cambiar con
        // el tiempo si se compraban lotes nuevos después. Ahora es estable en el tiempo.
        const totalCostOfGoodsSold = saleDetails.reduce((acc, detail) => acc + detail.quantity * (detail.unitCostAtSale ?? 0), 0);
        const avgSaleUnitCost = unitsSold > 0 ? totalCostOfGoodsSold / unitsSold : 0;

        const estimatedCOGS = avgSaleUnitCost * netUnitsSold;
        const grossProfit = netRevenue - estimatedCOGS;
        const marginPercent = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

        const inventoryItems = product.inventory?.inventoryItems ?? [];
        const currentStockTotal = inventoryItems.reduce((acc, item) => acc + item.quantityOnHand.value, 0);
        const salePriceOne = product.inventory?.salePriceOne?.value ?? 0;
        const currentStockSaleValue = currentStockTotal * salePriceOne;
        // Valorizado con el costo promedio móvil ACTUAL del producto (Product.averageCost), no con
        // el promedio de compras del rango filtrado: el stock de hoy vale lo que cuesta hoy.
        const currentStockCostValue = currentStockTotal * product.averageCost;

        return {
            productId,
            dateInit: dateInit ?? null,
            dateFinish: dateFinish ?? null,
            sales: {
                unitsSold,
                unitsReturned,
                netUnitsSold,
                grossRevenue,
                returnsAmount,
                netRevenue,
                lastSaleDate,
            },
            purchases: {
                unitsPurchased,
                totalCost,
                avgUnitCost,
                lastPurchaseDate,
            },
            profit: {
                estimatedCOGS,
                grossProfit,
                marginPercent,
            },
            inventory: {
                currentStockTotal,
                currentStockSaleValue,
                currentStockCostValue,
            },
        };
    }
}
