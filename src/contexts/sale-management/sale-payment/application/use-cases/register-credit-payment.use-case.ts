import { SalePaymentRepository } from "../../domain/repositories/sale-payment.repository";
import { RegisterCreditPaymentDTO } from "../dtos/register-credit-payment.dto";
import { SalePaymentNotFoundException } from "../../domain/exceptions/sale-payment-not-found.exception";
import { SalePaymentReferenceNumberVO } from "../../domain/value-objects/sale-payment-reference-number.vo";
import { SalePaymentAmountPaidVO } from "../../domain/value-objects/sale-payment-amount-paid.vo";
import { SalePaymentEntity } from "../../domain/entities/sale-payment.entity";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { SaleConflictException } from "src/contexts/sale-management/sale/domain/exceptions/sale-conflict.exception";
import { SalePaymentConflictException } from "../../domain/exceptions/sale-payment-conflict.exception";
import { SalePaymentInvalidException } from "../../domain/exceptions/sale-payment-invalid.exception";
import { TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { TransactionTypeRepository } from "src/contexts/transaction-management/transaction-type/domain/repositories/transaction-type.repository";
import { TransactionTypeInvalidException } from "src/contexts/transaction-management/transaction-type/domain/exceptions/transaction-type-invalid.exception";
import { CREDIT_PAYMENT_TRANSACTION_TYPE_NAME } from "src/contexts/transaction-management/transaction-type/domain/constants/transaction-type-names.constant";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { PaymentMethodRepository } from "@/contexts/sale-management/payment-method/domain/repositories/payment-method.repository";

export interface RegisterCreditPaymentResult {
    readonly sale: SaleEntity;
    readonly salePayments: SalePaymentEntity[];
}

export class RegisterCreditPaymentUseCase {
    constructor(
        private readonly saleRepository: SaleRepository,
        private readonly salePaymentRepository: SalePaymentRepository,
        private readonly paymentMethodRepository: PaymentMethodRepository,
        private readonly transactionRepository: TransactionRepository,
        private readonly transactionTypeRepository: TransactionTypeRepository,
        private readonly cashSessionRepo: CashSessionRepository,
        private readonly transactionDB: TransactionDBRepository,
    ) {}

    async execute(dto: RegisterCreditPaymentDTO): Promise<RegisterCreditPaymentResult> {
        if (!dto.payments || dto.payments.length === 0) {
            throw new SalePaymentInvalidException('Debes registrar al menos un método de pago para el abono.');
        }

        //* 1. Buscar la venta.
        const sale = await this.saleRepository.findById(dto.saleId);
        if (!sale) {
            throw new SalePaymentNotFoundException(`La venta con id ${dto.saleId} no existe.`);
        }

        //* 2. Validar que la venta esté en crédito.
        if (sale.status !== SaleStatusEnum.CREDIT) {
            throw new SalePaymentConflictException('La venta no está en crédito.');
        }

        //* 3. Validar sesión de caja abierta.
        const cashSession = await this.cashSessionRepo.isClosedCashSession(dto.cashRegisterId);
        if (!cashSession) {
            throw new SaleConflictException('Necesitas aperturar caja para continuar.');
        }

        //* 4. Sumar el abono y validar que sea mayor a 0.
        let amountToPay = 0;
        dto.payments.forEach(item => amountToPay += item.amountPaid);
        if (amountToPay <= 0) {
            throw new SalePaymentInvalidException('El monto del abono debe ser mayor a 0.');
        }

        //* 5. Recalcular el saldo real sumando los SalePayment existentes (no confiar solo en
        //* sale.paidAmount cacheado, mismo patrón que RegisterSalePaymentUseCase).
        const existingSalePayments = await this.salePaymentRepository.findAllBySaleId(dto.saleId);
        let totalPaidSoFar = 0;
        existingSalePayments.forEach(item => totalPaidSoFar += Number(item.amountPaid.value));

        const totalAmount = Number(sale.totalAmount);
        const remainingBalance = totalAmount - totalPaidSoFar;

        if (amountToPay > remainingBalance) {
            throw new SalePaymentConflictException('El abono excede el saldo pendiente de la venta.');
        }

        //* 6. Validar que cada método de pago exista.
        for (let i = 0; i < dto.payments.length; i++) {
            const isPaymentMethod = await this.paymentMethodRepository.existById(dto.payments[i].paymentMethodId);
            if (!isPaymentMethod) {
                throw new SalePaymentNotFoundException(`El método de pago con id ${dto.payments[i].paymentMethodId} no existe.`);
            }
        }

        //* 7. Persistir todo dentro de una transacción DB.
        return await this.transactionDB.runInTransaction(async () => {
            const salePayments = dto.payments.map(item =>
                SalePaymentEntity.create(
                    dto.saleId,
                    item.paymentMethodId,
                    dto.employeeId,
                    SalePaymentAmountPaidVO.create(item.amountPaid),
                    SalePaymentReferenceNumberVO.create(item.referenceNumber),
                )
            );

            const savedSalePayments = await this.salePaymentRepository.saveAll(salePayments);
            if (!savedSalePayments || savedSalePayments.length === 0) {
                throw new SalePaymentNotFoundException('Ocurrió un error al guardar el abono.');
            }

            const transactionType = await this.transactionTypeRepository.findByName(CREDIT_PAYMENT_TRANSACTION_TYPE_NAME);
            if (!transactionType) {
                throw new TransactionTypeInvalidException(`No existe el tipo de transacción '${CREDIT_PAYMENT_TRANSACTION_TYPE_NAME}'.`);
            }

            //* Una única Transaction por el monto TOTAL del abono (aunque sea mixto/varios métodos de pago).
            const transaction = TransactionEntity.create(
                transactionType.transactionTypeId,
                sale.branchOfficeId,
                null,
                sale.saleId,
                dto.employeeId,
                cashSession.cashSessionId,
                amountToPay,
                `Abono a crédito de la venta #${sale.saleId}.`
            );
            await this.transactionRepository.save(transaction);

            const newPaidAmount = totalPaidSoFar + amountToPay;
            sale.updatePaidAmount(newPaidAmount);
            if (newPaidAmount === totalAmount) {
                sale.updateStatus(SaleStatusEnum.COMPLETED);
            }

            const savedSale = await this.saleRepository.save(sale);

            return { sale: savedSale, salePayments: savedSalePayments };
        });
    }
}
