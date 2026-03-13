import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { PaymentMethodEntity } from "../entities/payment-method-entity";

export const PAYMENT_METHOD = Symbol('PAYMENT_METHOD');

export interface PaymentMethodRepository extends TemplateRepository<PaymentMethodEntity>{

}