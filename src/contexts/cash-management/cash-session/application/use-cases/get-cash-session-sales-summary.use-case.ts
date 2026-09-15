import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { CashSessionSalesSummaryResponseDTO } from "../dtos/cash-session-sales-summary-response.dto";

export class GetCashSessionSalesSummaryUseCase {
    constructor(
        private readonly cashSessionRepository: CashSessionRepository,
    ) { }

    async execute(cashSessionId: bigint): Promise<CashSessionSalesSummaryResponseDTO> {
        const cashSession = await this.cashSessionRepository.findCashSessionWithSalesDetails(cashSessionId);
        if (!cashSession) {
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }

        const completedSales = (cashSession.sales ?? []).filter(sale => sale.status === SaleStatusEnum.COMPLETED);
        const salesCount = completedSales.length;
        const saleDetails = completedSales.flatMap(sale => sale.saleDetails ?? []);

        // Ventas netas: bruto de las ventas COMPLETED menos lo devuelto por el cliente sobre esos
        // mismos detalles (returns.amountReturn). Una devolución no crea/edita un Sale, sólo filas
        // en `returns` — sale.totalAmount se queda con el monto bruto para siempre, por eso no
        // basta con sumarlo directamente. Mismo criterio que GetProductPerformanceUseCase
        // (grossRevenue - returnsAmount = netRevenue).
        const grossSales = completedSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
        const returnsAmount = saleDetails.reduce(
            (acc, detail) => acc + (detail.returns?.reduce((sum, item) => sum + item.amountReturn, 0) ?? 0),
            0,
        );
        const totalSales = grossSales - returnsAmount;

        // Costo de lo vendido: se suma (quantity - quantityReturn) * unitCostAtSale, congelado en
        // cada detalle de venta al momento de vender (Product.averageCost en ese instante). Las
        // unidades devueltas no cuestan nada al negocio en este turno — se excluyen del costo igual
        // que se excluyen de las ventas. Ya no se recalcula un promedio en vivo sobre los lotes
        // actuales — el resumen de una sesión de caja ya cerrada no debe moverse con el tiempo
        // aunque se compren lotes nuevos después.
        const totalInvested = saleDetails.reduce((acc, detail) => {
            const unitsReturned = detail.returns?.reduce((sum, item) => sum + item.quantityReturn, 0) ?? 0;
            const netQuantity = detail.quantity - unitsReturned;
            return acc + netQuantity * (detail.unitCostAtSale ?? 0);
        }, 0);

        const profit = totalSales - totalInvested;
        const marginPercent = totalSales > 0 ? (profit / totalSales) * 100 : 0;

        return {
            cashSessionId,
            salesCount,
            grossSales,
            returnsAmount,
            totalSales,
            totalInvested,
            profit,
            marginPercent,
        };
    }
}
