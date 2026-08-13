import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { LotRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot.repository";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { CashSessionSalesSummaryResponseDTO } from "../dtos/cash-session-sales-summary-response.dto";

export class GetCashSessionSalesSummaryUseCase {
    constructor(
        private readonly cashSessionRepository: CashSessionRepository,
        private readonly lotRepository: LotRepository,
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

        const productIds = Array.from(new Set(saleDetails.map(detail => detail.productId)));
        const avgUnitCostByProduct = new Map<bigint, number>();
        await Promise.all(productIds.map(async productId => {
            const lots = await this.lotRepository.findAllByProductId(productId);
            const unitsPurchased = lots.reduce((acc, lot) => acc + lot.initialQuantity, 0);
            const totalCost = lots.reduce((acc, lot) => acc + lot.purchasePrice * lot.initialQuantity, 0);
            avgUnitCostByProduct.set(productId, unitsPurchased > 0 ? totalCost / unitsPurchased : 0);
        }));

        const totalInvested = saleDetails.reduce((acc, detail) => {
            const avgUnitCost = avgUnitCostByProduct.get(detail.productId) ?? 0;
            return acc + detail.quantity * avgUnitCost;
        }, 0);

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
