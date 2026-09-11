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
        const totalSales = completedSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
        const saleDetails = completedSales.flatMap(sale => sale.saleDetails ?? []);

        // Costo de lo vendido: se suma quantity * unitCostAtSale, congelado en cada detalle de
        // venta al momento de vender (Product.averageCost en ese instante). Ya no se recalcula un
        // promedio en vivo sobre los lotes actuales — el resumen de una sesión de caja ya cerrada
        // no debe moverse con el tiempo aunque se compren lotes nuevos después.
        const totalInvested = saleDetails.reduce((acc, detail) => acc + detail.quantity * (detail.unitCostAtSale ?? 0), 0);

        const profit = totalSales - totalInvested;
        const marginPercent = totalSales > 0 ? (profit / totalSales) * 100 : 0;

        return {
            cashSessionId,
            salesCount,
            totalSales,
            totalInvested,
            profit,
            marginPercent,
        };
    }
}
