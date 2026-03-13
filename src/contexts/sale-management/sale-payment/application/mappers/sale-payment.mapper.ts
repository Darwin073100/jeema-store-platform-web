import { PaymentMethodMapper } from "src/contexts/sale-management/payment-method/application/mappers/payment-method-mapper";
import { SalePaymentEntity } from "../../domain/entities/sale-payment.entity";
import { SalePaymentResponseDTO } from "../dtos/sale-payment-response.dto";

export class SalePaymentMapper{
    static toResponseDto(entity: SalePaymentEntity): SalePaymentResponseDTO {
        return {
            salePaymentId: entity.salePaymentId,
            paymentMethodId: entity.paymentMethodId,
            saleId: entity.saleId,
            amountPaid: Number(entity.amountPaid.value),
            referenceNumber: entity.referenceNumber?.value,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            paymentMethod:entity.paymentMethod?  PaymentMethodMapper.toResponseDto(entity.paymentMethod): null,
        };
    }
}