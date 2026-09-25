import { PaymentMethodResponseDto } from "src/contexts/sale-management/payment-method/application/dtos/payment-method-response.dto";
import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";

export class SalePaymentResponseDTO{
    readonly salePaymentId: bigint;
    readonly paymentMethodId: bigint;
    readonly saleId: bigint;
    readonly employeeId: bigint;
    readonly amountPaid: number;
    readonly referenceNumber?: string| null;
    readonly createdAt: Date;
    readonly updatedAt?: Date | null;
    readonly deletedAt?: Date | null;
    readonly paymentMethod?: PaymentMethodResponseDto | null;
    readonly employee?: EmployeeResponseDto | null;
}