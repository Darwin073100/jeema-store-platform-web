import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { SalePaymentEntity } from "../entities/sale-payment.entity";

export const SALE_PAYMENT_REPOSITORY = Symbol('SALE_PAYMENT_REPOSITORY');

export interface SalePaymentRepository extends TemplateRepository<SalePaymentEntity>{
    saveAll(entities: SalePaymentEntity[]): Promise<SalePaymentEntity[]>;
    findAllBySaleId(saleId: bigint): Promise<SalePaymentEntity[]>;
    existById(entityId: bigint): Promise<SalePaymentEntity | null>;
}