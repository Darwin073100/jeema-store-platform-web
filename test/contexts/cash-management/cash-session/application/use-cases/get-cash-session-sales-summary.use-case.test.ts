import { GetCashSessionSalesSummaryUseCase } from '@/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case';
import { CashSessionRepository } from '@/contexts/cash-management/cash-session/domain/repositories/cash-session.repository';
import { CashSessionEntity } from '@/contexts/cash-management/cash-session/domain/entities/cash-session.entity';
import { SaleEntity } from '@/contexts/sale-management/sale/domain/entities/sale.entity';
import { SaleDetailEntity } from '@/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity';
import { SaleStatusEnum } from '@/contexts/sale-management/sale/domain/enums/sale-status.enum';
import { SaleForEnum } from '@/contexts/sale-management/sale-detail/domain/enums/sale-for.enum';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { ReturnsEntity } from '@/contexts/sale-management/returns/domain/entities/returns.entity';
import { CashSessionNotFoundException } from '@/contexts/cash-management/cash-session/domain/exceptions/cash-session-not-found.exception';

const CASH_SESSION_ID = BigInt(258);

function buildReturn(quantityReturn: number, amountReturn: number) {
    return ReturnsEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        quantityReturn,
        amountReturn,
        null,
        null,
        null,
        null,
        new Date(),
        null,
        null,
    );
}

function buildSaleDetail(params: {
    quantity: number;
    subtotalItem: number;
    unitCostAtSale: number | null;
    returns?: { quantityReturn: number; amountReturn: number }[];
}) {
    const returns = params.returns?.map(r => buildReturn(r.quantityReturn, r.amountReturn)) ?? null;
    return SaleDetailEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        'Agujas',
        '000000',
        ForSaleEnum.PC,
        params.quantity,
        20,
        20,
        params.subtotalItem,
        0,
        SaleForEnum.ONE,
        null,
        null,
        null,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        returns,
        params.unitCostAtSale,
    );
}

function buildSale(params: {
    totalAmount: number;
    status: SaleStatusEnum;
    saleDetails: SaleDetailEntity[];
}) {
    return SaleEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        BigInt(1),
        BigInt(1),
        CASH_SESSION_ID,
        params.totalAmount, 0, 0, params.totalAmount, 0, 0, 0,
        params.status,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        null,
        params.saleDetails,
        null,
        null,
    );
}

function buildCashSession(sales: SaleEntity[]) {
    return CashSessionEntity.reconstitute(
        CASH_SESSION_ID,
        BigInt(1),
        BigInt(1),
        new Date(),
        700,
        null,
        null,
        null,
        null,
        false,
        null,
        new Date(),
        null,
        null,
        null,
        null,
        null,
        sales,
    );
}

describe('GetCashSessionSalesSummaryUseCase', () => {
    let cashSessionRepository: jest.Mocked<CashSessionRepository>;
    let useCase: GetCashSessionSalesSummaryUseCase;

    beforeEach(() => {
        cashSessionRepository = {
            findCashSessionWithSalesDetails: jest.fn(),
        } as unknown as jest.Mocked<CashSessionRepository>;
        useCase = new GetCashSessionSalesSummaryUseCase(cashSessionRepository);
    });

    test('descuenta las unidades y el monto devuelto de ventas, invertido y ganancia', async () => {
        // Venta A: 10 agujas vendidas, el cliente devuelve 5 — sólo las 5 restantes deben contar.
        const saleA = buildSale({
            totalAmount: 200,
            status: SaleStatusEnum.COMPLETED,
            saleDetails: [
                buildSaleDetail({
                    quantity: 10,
                    subtotalItem: 200,
                    unitCostAtSale: 10,
                    returns: [{ quantityReturn: 5, amountReturn: 100 }],
                }),
            ],
        });
        // Venta B: sin devoluciones.
        const saleB = buildSale({
            totalAmount: 150,
            status: SaleStatusEnum.COMPLETED,
            saleDetails: [
                buildSaleDetail({ quantity: 3, subtotalItem: 150, unitCostAtSale: 30 }),
            ],
        });
        // Venta C: no completada, debe excluirse por completo.
        const saleC = buildSale({
            totalAmount: 999,
            status: SaleStatusEnum.PENDING,
            saleDetails: [buildSaleDetail({ quantity: 1, subtotalItem: 999, unitCostAtSale: 5 })],
        });

        cashSessionRepository.findCashSessionWithSalesDetails.mockResolvedValue(buildCashSession([saleA, saleB, saleC]));

        const result = await useCase.execute(CASH_SESSION_ID);

        expect(result.salesCount).toBe(2);
        expect(result.grossSales).toBe(350); // 200 + 150
        expect(result.returnsAmount).toBe(100);
        expect(result.totalSales).toBe(250); // 350 - 100, coincide con lo que descuenta el Corte
        expect(result.totalInvested).toBe(140); // (10-5)*10 + 3*30 = 50 + 90
        expect(result.profit).toBe(110); // 250 - 140
        expect(result.marginPercent).toBeCloseTo((110 / 250) * 100, 5);
    });

    test('no divide por cero cuando no hay ventas completadas en la sesión', async () => {
        cashSessionRepository.findCashSessionWithSalesDetails.mockResolvedValue(buildCashSession([]));

        const result = await useCase.execute(CASH_SESSION_ID);

        expect(result.salesCount).toBe(0);
        expect(result.grossSales).toBe(0);
        expect(result.returnsAmount).toBe(0);
        expect(result.totalSales).toBe(0);
        expect(result.totalInvested).toBe(0);
        expect(result.profit).toBe(0);
        expect(result.marginPercent).toBe(0);
    });

    test('lanza CashSessionNotFoundException cuando no existe la sesión', async () => {
        cashSessionRepository.findCashSessionWithSalesDetails.mockResolvedValue(null);

        await expect(useCase.execute(CASH_SESSION_ID)).rejects.toThrow(CashSessionNotFoundException);
    });
});
