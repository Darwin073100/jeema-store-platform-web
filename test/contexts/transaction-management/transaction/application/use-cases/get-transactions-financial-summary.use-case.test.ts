import { GetTransactionsFinancialSummaryUseCase } from '@/contexts/transaction-management/transaction/application/use-cases/get-transactions-financial-summary.use-case';
import { SaleRepository } from '@/contexts/sale-management/sale/domain/repositories/sale.repository';
import { TransactionEntity } from '@/contexts/transaction-management/transaction/domain/entities/transaction.entity';
import { TransactionTypeEntity } from '@/contexts/transaction-management/transaction-type/domain/entities/transaction-type.entity';
import { AccountTypeEnum } from '@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum';
import { SaleEntity } from '@/contexts/sale-management/sale/domain/entities/sale.entity';
import { SaleDetailEntity } from '@/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity';
import { SaleStatusEnum } from '@/contexts/sale-management/sale/domain/enums/sale-status.enum';
import { SaleForEnum } from '@/contexts/sale-management/sale-detail/domain/enums/sale-for.enum';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';
import { ReturnsEntity } from '@/contexts/sale-management/returns/domain/entities/returns.entity';

function buildTransactionType(name: string, accountType: AccountTypeEnum) {
    return TransactionTypeEntity.reconstitute(BigInt(1), name, null, accountType, new Date(), null, null, []);
}

function buildTransaction(params: {
    saleId: bigint | null;
    amount: number;
    typeName: string;
    accountType: AccountTypeEnum;
}) {
    return TransactionEntity.reconstitute(
        BigInt(1),
        BigInt(1),
        BigInt(1),
        null,
        params.saleId,
        BigInt(1),
        BigInt(1),
        params.amount,
        null,
        new Date(),
        null,
        null,
        buildTransactionType(params.typeName, params.accountType),
        null,
        null,
        null,
        null,
    );
}

function buildReturn(quantityReturn: number, amountReturn: number) {
    return ReturnsEntity.reconstitute(
        BigInt(1), BigInt(1), BigInt(1), BigInt(1),
        quantityReturn, amountReturn, null,
        null, null, null,
        new Date(), null, null,
    );
}

function buildSale(params: {
    saleId: bigint;
    status: SaleStatusEnum;
    quantity: number;
    subtotalItem: number;
    unitCostAtSale: number | null;
    returns?: { quantityReturn: number; amountReturn: number }[];
}) {
    const saleDetail = SaleDetailEntity.reconstitute(
        BigInt(1), params.saleId, BigInt(1), BigInt(1),
        'Agujas', '000000', ForSaleEnum.PC,
        params.quantity, 20, 20, params.subtotalItem, 0,
        SaleForEnum.ONE, null, null, null, null,
        new Date(), null, null,
        null, null, null,
        params.returns?.map(r => buildReturn(r.quantityReturn, r.amountReturn)) ?? null,
        params.unitCostAtSale,
    );
    return SaleEntity.reconstitute(
        params.saleId, BigInt(1), BigInt(1), BigInt(1), BigInt(1),
        params.subtotalItem, 0, 0, params.subtotalItem, 0, 0,
        params.status, null, new Date(), null, null,
        null, null, null, null,
        [saleDetail], null, null,
    );
}

describe('GetTransactionsFinancialSummaryUseCase', () => {
    let saleRepository: jest.Mocked<SaleRepository>;
    let useCase: GetTransactionsFinancialSummaryUseCase;

    beforeEach(() => {
        saleRepository = { findManyWithDetailsByIds: jest.fn() } as unknown as jest.Mocked<SaleRepository>;
        useCase = new GetTransactionsFinancialSummaryUseCase(saleRepository);
    });

    test('neta ingresos por devoluciones y excluye la devolución de egresos (no la resta dos veces)', async () => {
        const saleA = buildSale({
            saleId: BigInt(1),
            status: SaleStatusEnum.COMPLETED,
            quantity: 10,
            subtotalItem: 200,
            unitCostAtSale: 10,
            returns: [{ quantityReturn: 5, amountReturn: 100 }],
        });
        const saleB = buildSale({
            saleId: BigInt(2),
            status: SaleStatusEnum.COMPLETED,
            quantity: 3,
            subtotalItem: 150,
            unitCostAtSale: 30,
        });
        saleRepository.findManyWithDetailsByIds.mockResolvedValue([saleA, saleB]);

        const transactions = [
            buildTransaction({ saleId: BigInt(1), amount: 200, typeName: 'Ingreso por Venta de Mercancía', accountType: AccountTypeEnum.INCOME }),
            buildTransaction({ saleId: BigInt(2), amount: 150, typeName: 'Ingreso por Venta de Mercancía', accountType: AccountTypeEnum.INCOME }),
            buildTransaction({ saleId: null, amount: 700, typeName: 'Apertura de Caja', accountType: AccountTypeEnum.INCOME }),
            buildTransaction({ saleId: BigInt(1), amount: 100, typeName: 'Devolución por Venta al Cliente', accountType: AccountTypeEnum.EXPENSE }),
            buildTransaction({ saleId: null, amount: 700, typeName: 'Retiro de efectivo/Corte de caja', accountType: AccountTypeEnum.EXPENSE }),
            buildTransaction({ saleId: null, amount: 50, typeName: 'Pago de Servicios (Luz, Agua, Internet)', accountType: AccountTypeEnum.EXPENSE }),
        ];

        const result = await useCase.execute(transactions);

        expect(result.grossIncomes).toBe(350); // 200 + 150, "Apertura de Caja" excluida
        expect(result.returnsAmount).toBe(100);
        expect(result.totalIncomes).toBe(250); // 350 - 100
        expect(result.totalInvested).toBe(140); // (10-5)*10 + 3*30
        expect(result.profitBeforeExpenses).toBe(110); // 250 - 140

        // La devolución NO debe contarse como egreso (ya se descontó de los ingresos) — sólo
        // "Pago de Servicios" es un egreso real aquí; "Retiro de efectivo/Corte de caja" también
        // está excluido (comportamiento preexistente).
        expect(result.totalExpenses).toBe(50);
        expect(result.profitAfterExpenses).toBe(60); // 110 - 50

        expect(result.marginBeforeExpensesPercent).toBeCloseTo((110 / 250) * 100, 5);
        expect(result.marginAfterExpensesPercent).toBeCloseTo((60 / 250) * 100, 5);
        expect(result.salesCountConsidered).toBe(2);
    });

    test('no divide por cero cuando no hay transacciones', async () => {
        saleRepository.findManyWithDetailsByIds.mockResolvedValue([]);

        const result = await useCase.execute([]);

        expect(result.totalIncomes).toBe(0);
        expect(result.totalInvested).toBe(0);
        expect(result.profitBeforeExpenses).toBe(0);
        expect(result.totalExpenses).toBe(0);
        expect(result.profitAfterExpenses).toBe(0);
        expect(result.marginBeforeExpensesPercent).toBe(0);
        expect(result.marginAfterExpensesPercent).toBe(0);
        expect(result.salesCountConsidered).toBe(0);
    });
});
