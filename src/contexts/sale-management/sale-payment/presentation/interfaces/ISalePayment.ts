import { IPaymentMethod } from "@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";

export interface ISalePayment{
    readonly salePaymentId: bigint;
    readonly paymentMethodId: bigint;
    readonly saleId: bigint;
    readonly amountPaid: number;
    readonly referenceNumber: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date | null;
    readonly deletedAt: Date | null;
    readonly paymentMethod: IPaymentMethod | null;
    readonly sale: ISale | null;
}