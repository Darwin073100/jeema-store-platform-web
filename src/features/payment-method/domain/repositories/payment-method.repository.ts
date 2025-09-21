import { Result } from "@/shared/features/result";
import { PaymentMethodEntity } from "../entities/payment-method-entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export interface PaymentMethodRepository {
    findAll(): Promise<Result<{paymentMethods:PaymentMethodEntity[]}, ErrorEntity>>
}