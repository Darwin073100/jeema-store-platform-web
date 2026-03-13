import { PaymentMethodOrmEntity } from "../entities/payment-method.orm-entity";
import { PaymentMethodEntity } from "src/contexts/sale-management/payment-method/domain/entities/payment-method-entity";
import { PaymentMethodNameVO } from "src/contexts/sale-management/payment-method/domain/value-objects/payment-method-name.vo";
import { SalePaymentMapper } from "src/contexts/sale-management/sale-payment/infraestructure/mappers/sale-payment.mapper";

export class PaymentMethodMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: PaymentMethodEntity): PaymentMethodOrmEntity {
        const typeOrmEntity = new PaymentMethodOrmEntity();
        typeOrmEntity.paymentMethodId = domainEntity.paymentMethodId;
        typeOrmEntity.name = domainEntity.name.name;
        typeOrmEntity.requiresReference = domainEntity.requiresReference;
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        typeOrmEntity.salePayments = domainEntity.salePayments?.map(item => SalePaymentMapper.toOrm(item)) ?? undefined;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: PaymentMethodOrmEntity): PaymentMethodEntity {
        return PaymentMethodEntity.reconstitute(
            typeOrmEntity.paymentMethodId,
            PaymentMethodNameVO.create(typeOrmEntity.name),
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
            typeOrmEntity.deletedAt,
            typeOrmEntity.requiresReference,
            typeOrmEntity.salePayments?.map( item=> SalePaymentMapper.toDomain(item)) ?? undefined,
        );
    }
}