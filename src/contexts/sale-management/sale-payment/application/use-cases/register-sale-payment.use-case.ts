import { PaymentMethodCheckerPort } from "src/contexts/sale-management/payment-method/domain/ports/out/payment-method-checker.port";
import { SalePaymentRepository } from "../../domain/repositories/sale-payment.repository";
import { RegisterSalePaymentDTO } from "../dtos/register-sale-payment.dto";
import { SalePaymentNotFoundException } from "../../domain/exceptions/sale-payment-not-found.exception";
import { SaleNotFoundException } from "src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception";
import { SalePaymentReferenceNumberVO } from "../../domain/value-objects/sale-payment-reference-number.vo";
import { SaleTotalAmountVO } from "src/contexts/sale-management/sale/domain/value-objects/sale-total-amount.vo";
import { SalePaymentEntity } from "../../domain/entities/sale-payment.entity";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { SalePaymentConflictException } from "../../domain/exceptions/sale-payment-conflict.exception";
import { SalePaymentInvalidException } from "../../domain/exceptions/sale-payment-invalid.exception";
import { TransactionRepository } from "src/contexts/transaction-management/transaction/domain/repositories/transaction.repository";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";

export class RegisterSalePaymentUseCase {
    constructor(
        private readonly salePaymentRepository: SalePaymentRepository,
        private readonly saleRepository: SaleRepository,
        private readonly paymentMethodCheckerPort: PaymentMethodCheckerPort,
        private readonly transactionRepository: TransactionRepository,
        private readonly connection: TransactionDBRepository
    ){}

    async execute(dtos: RegisterSalePaymentDTO[]){
        let amountPaid = 0;
        let saleId: bigint = dtos[0].saleId;

        dtos.forEach(dto=>{
            // Verificar
            if(saleId===dto.saleId){
                saleId = dto.saleId
            } else {
                throw new SalePaymentInvalidException('El id de la venta debe ser el msimo para los metodos de pago.');
            }
        })

        
        const sale = await this.saleRepository.findById(saleId);
        if(!sale){
            throw new SalePaymentNotFoundException(`La venta con id ${saleId} no existe.`);
        }

        if(sale.status !== SaleStatusEnum.COMPLETED){
            throw new SalePaymentConflictException(`La venta con id ${saleId} aún no se ha completado.`);
        }
        
        dtos.forEach(item=> amountPaid += item.amountPaid);
        //? Verificar si ya hay algun pago o abono en la base de datos.
        const salePaymentExist = await this.salePaymentRepository.findAllBySaleId(saleId);
        if(salePaymentExist && salePaymentExist.length > 0){
            let totalAllSale:number = 0;
            //? Sacar el total abonado
            salePaymentExist.forEach( item => totalAllSale += Number(item.amountPaid.value));

            //! Retornar un error por si la venta ya se ha liquidado
            if(totalAllSale === Number(sale.totalAmount)){
                throw new SalePaymentConflictException(`La venta ya se ha liquidado anteriormente.`);
            }
        }

        const totalAmount = Number(sale.totalAmount);
        if(amountPaid >= totalAmount){
            const transaction = TransactionEntity.create(
                BigInt(1),
                sale.branchOfficeId,
                null,
                sale.saleId,
                sale.employeeId,
                sale.cashSessionId,
                totalAmount,
                'Ingreso por venta realizada.'
            );
            await this.transactionRepository.save(transaction);
        }

        for(let i =0; i < dtos.length; i++){
            const isPaymentMethod = await this.paymentMethodCheckerPort.exists(dtos[i].paymentMethodId);
            if(!isPaymentMethod){
                throw new SalePaymentNotFoundException(`El método de pago con id ${dtos[i].paymentMethodId} no existe.`);
            }
        }

        const salePayments = dtos.map(dto => {
             return SalePaymentEntity.create(
                dto.saleId,
                dto.paymentMethodId,
                SaleTotalAmountVO.create(dto.amountPaid),
                SalePaymentReferenceNumberVO.create(dto.referenceNumber),
            );
        });

        const salePaymentResult = await this.salePaymentRepository.saveAll(salePayments);
        if(!salePaymentResult) {
            if(salePayments.length>1){
                throw new SaleNotFoundException('Ocurrio un error al guardar el método de pago.');
            }
            throw new SaleNotFoundException('Ocurrio un error al guardar los métodos de pago.');
        }

        return salePaymentResult;
    }
}