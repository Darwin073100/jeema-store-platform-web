import { SaleRepository } from "../../domain/repositories/sale.repository";
import { EmployeeChekerPort } from "src/contexts/employee-management/employee/domain/ports/out/employee-checker.port";
import { CustomerCheckerPort } from "src/contexts/sale-management/customer/domain/ports/out/customer-checker-port";
import { SaleNotFoundException } from "../../domain/exceptions/sale-not-found.exception";
import { CalculateSaleDTO } from "../dtos/calculate-sale.dto";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { DiscountInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { SaleConflictException } from "../../domain/exceptions/sale-conflict.exception";
import { RegisterSalePaymentUseCase } from "src/contexts/sale-management/sale-payment/application/use-cases/register-sale-payment.use-case";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { formatDateTimeForInput } from "@/shared/lib/utils/date-formatter";

export class CalculateSaleUseCase {
    constructor(
        private readonly saleRepository: SaleRepository,
        private readonly employeeCheckerPort: EmployeeChekerPort,
        private readonly customerCheckerPort: CustomerCheckerPort,
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly discountInventoryItem: DiscountInventoryItemUseCase,
        private readonly cashSessionRepo: CashSessionRepository,
        private readonly registerSalePaymentUseCase: RegisterSalePaymentUseCase,
        private readonly transactionDB: TransactionDBRepository
    ) { }

    async execute(dto: CalculateSaleDTO) {
        try {
            this.transactionDB.beginTransaction()
            //* Bloque 1: Verificar que existan los registros involucrados
            // const isSale = await this.saleCheckerPort.existById(dto.saleId);
            const sale = await this.saleRepository.findById(dto.saleId);
            if (!sale) {
                throw new SaleNotFoundException(`La venta con id ${dto.saleId} no existe.`);
            }

            const isEmployee = await this.employeeCheckerPort.exists(dto.employeeId);
            if (!isEmployee) {
                throw new SaleNotFoundException(`El empleado con id ${dto.employeeId} no existe.`);
            }

            const isCustomer = await this.customerCheckerPort.existById(dto.customerId);
            if (!isCustomer) {
                throw new SaleNotFoundException(`El cliente con id ${dto.customerId} no existe.`);
            }

            const cashSession = await this.cashSessionRepo.isClosedCashSession(dto.cashRegisterId);
            if (!cashSession) throw new SaleConflictException(`Necesitas aperturar caja para continuar.`);


            //* Bloque 2: hacer los calculos para sacar los precios
            const saleDetails = sale.saleDetails;
            let saleTotal: number = Number(sale.totalAmount);
            let subTotal: number = Number(sale.subTotalAmount);
            let taxAmount: number = Number(sale.taxAmount);
            let discount: number = Number(0);
            let outAmount: number = Number(sale.outAmount);

            if (saleDetails) {
                let newSaleTotal: number = 0;
                let newSubTotal: number = 0;
                let newTaxAmount: number = 0;
                let newDiscount: number = 0;

                for (let i = 0; i < saleDetails.length; i++) {
                    newSaleTotal = newSaleTotal + Number(saleDetails[i].subtotalItem); //? Total de la venta
                    newSubTotal = newSubTotal + Number(saleDetails[i].subtotalItem); //? Sub Total de la venta, Total sin descuento
                    newDiscount = newDiscount + Number(saleDetails[i].discountItem); //? Total de descuento
                    // newTaxAmount = newTaxAmount + (newSaleTotal * 0.16); //? Cantidad bruta a pagar, Total - %IVA
                }
                saleTotal = newSaleTotal;
                subTotal = newSubTotal;
                taxAmount = saleTotal * 0.16;
                discount = newDiscount;
                outAmount = dto.inAmount - saleTotal;
            }

            sale.updateCustomerId(dto.customerId);
            sale.updateEmployeeId(dto.employeeId);
            sale.updateCashSessionId(cashSession.cashSessionId);
            sale.updateSubTotalAmount(subTotal);
            sale.updateDiscountAmount(discount);
            sale.updateTaxAmount(taxAmount);
            sale.updateTotalAmount(saleTotal);
            sale.updateStatus(dto.status);
            sale.updateNotes(dto.notes);
            sale.updateInAmount(dto.inAmount);
            sale.updateCreatedAt(new Date(formatDateTimeForInput(new Date())));
            if(dto.status === SaleStatusEnum.CANCELLED){
                outAmount=0;
            }
            sale.updateOutAmount(outAmount);

            const saleResult = await this.saleRepository.save(sale);

            if (!saleResult) throw new SaleNotFoundException('No se pudo finalizar la venta.');
            if(dto.status === SaleStatusEnum.COMPLETED){
                if (saleResult.saleDetails && saleResult.saleDetails.length > 0) {
                    if ((saleResult.status === SaleStatusEnum.INITIALIZED || saleResult.status === SaleStatusEnum.COMPLETED || saleResult.status === SaleStatusEnum.PENDING)) {
                        for (let i = 0; i < (saleResult.saleDetails?.length ?? 0); i++) {
                            const item = await this.inventoryItemRepository.findByLocation(saleResult.saleDetails[i].inventoryItemId, LocationEnum.SALE);
                            if (!item?.inventoryItemId) {
                                throw new SaleConflictException('No pudimos finalizar la venta.');
                            }
                            await this.discountInventoryItem.execute(item.inventoryItemId, Number(saleResult.saleDetails[i].quantity));
                        }
                    } else {
                        throw new SaleConflictException('No pudimos finalizar la venta.');
                    }
                } else {
                    throw new SaleConflictException('No pudimos finalizar la venta.');
                }
                if(dto.salePayments.length > 0){
                    await this.registerSalePaymentUseCase.execute(dto.salePayments);
                }
            }
            this.transactionDB.commit();
            return saleResult;
        } catch (error) {
            this.transactionDB.rollback();
            throw error;
        }
    }
}