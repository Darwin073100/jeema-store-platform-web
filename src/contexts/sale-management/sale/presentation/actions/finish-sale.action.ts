'use server';
import { revalidatePath } from "next/cache";
import { TypeormSaleRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-sale.repository";
import { CalculateSaleUseCase } from "../../application/use-cases/calculate-sale.use-case";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmCustomerRepository } from "@/contexts/sale-management/customer/infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { TypeormInventoryItemRepository } from "@/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/repositories/typeorm-inventory-item.repository";
import { DiscountInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case";
import { TypeormCashSessionRepository } from "@/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository";
import { RegisterSalePaymentUseCase } from "@/contexts/sale-management/sale-payment/application/use-cases/register-sale-payment.use-case";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { TypeormSalePaymentRepository } from "@/contexts/sale-management/sale-payment/infraestructure/repositories/typeorm-sale-payment.repository";
import { TypeormPaymentMethodRepository } from "@/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/repositories/typeorm-payment-method.repository";
import { TypeormTransactionRepository } from "@/contexts/transaction-management/transaction/infraestructure/repositories/typeorm-transaction.repository";
import { CalculateSaleDTO } from "../../application/dtos/calculate-sale.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { SaleMapper } from "../../application/mappers/sale-mapper";

export async function finishSaleAction(dto: CalculateSaleDTO) {
    console.log('SE ejecuto server action');
    try {
        const repository = await TypeormSaleRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const customerRepository = await TypeOrmCustomerRepository.create();
        const inventoryItemRepository = await TypeormInventoryItemRepository.create();
        const discountInventoryItem = new DiscountInventoryItemUseCase(inventoryItemRepository);
        const cashSessionRepo = await TypeormCashSessionRepository.create();
        const salePaymentRepo = await TypeormSalePaymentRepository.create();
        const paymentMethodRepo = await TypeormPaymentMethodRepository.create();
        const transactionRepo = await TypeormTransactionRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();
        const registerSalePaymentUseCase = new RegisterSalePaymentUseCase(salePaymentRepo, repository, paymentMethodRepo, transactionRepo, transactionDB);
        const useCase = new CalculateSaleUseCase(repository, employeeRepository, customerRepository, inventoryItemRepository, discountInventoryItem, cashSessionRepo, registerSalePaymentUseCase, transactionDB);

        const result = await useCase.execute(dto);

        revalidatePath('/sale');
        revalidatePath('/sale/new');
        return {
            ...Result.success(SaleMapper.toIResponse(result))
        }
    } catch (error) {
        return {
            ...handleError(error, 'finishSaleAction'),
        }
    }
}