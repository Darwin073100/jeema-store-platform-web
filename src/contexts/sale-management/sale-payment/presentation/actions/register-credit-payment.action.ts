'use server';
import { revalidatePath } from "next/cache";
import { RegisterCreditPaymentUseCase } from "../../application/use-cases/register-credit-payment.use-case";
import { RegisterCreditPaymentDTO } from "../../application/dtos/register-credit-payment.dto";
import { TypeormSaleRepository } from "@/contexts/sale-management/sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { TypeormSalePaymentRepository } from "@/contexts/sale-management/sale-payment/infraestructure/repositories/typeorm-sale-payment.repository";
import { TypeormPaymentMethodRepository } from "@/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/repositories/typeorm-payment-method.repository";
import { TypeormTransactionRepository } from "@/contexts/transaction-management/transaction/infraestructure/repositories/typeorm-transaction.repository";
import { TypeormTransactionTypeRepository } from "@/contexts/transaction-management/transaction-type/infraestructure/repositories/typeorm-transaction-type.repository";
import { TypeormCashSessionRepository } from "@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { SaleMapper } from "@/contexts/sale-management/sale/application/mappers/sale-mapper";
import { SalePaymentMapper } from "../../application/mappers/sale-payment.mapper";

export async function registerCreditPaymentAction(dto: RegisterCreditPaymentDTO) {
    try {
        const saleRepository = await TypeormSaleRepository.create();
        const salePaymentRepository = await TypeormSalePaymentRepository.create();
        const paymentMethodRepository = await TypeormPaymentMethodRepository.create();
        const transactionRepository = await TypeormTransactionRepository.create();
        const transactionTypeRepository = await TypeormTransactionTypeRepository.create();
        const cashSessionRepository = await TypeormCashSessionRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();

        const useCase = new RegisterCreditPaymentUseCase(
            saleRepository,
            salePaymentRepository,
            paymentMethodRepository,
            transactionRepository,
            transactionTypeRepository,
            cashSessionRepository,
            transactionDB,
        );

        const result = await useCase.execute(dto);

        revalidatePath('/sale');
        revalidatePath(`/sale/${dto.saleId}`);

        return {
            ...Result.success({
                sale: SaleMapper.toIResponse(result.sale),
                salePayments: result.salePayments.map(item => SalePaymentMapper.toIResponse(item)),
            })
        }
    } catch (error) {
        return {
            ...handleError(error, 'registerCreditPaymentAction'),
        }
    }
}
