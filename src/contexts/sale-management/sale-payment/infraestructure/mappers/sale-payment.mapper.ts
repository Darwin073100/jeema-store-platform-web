import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";
import { SalePaymentEntity } from "../../domain/entities/sale-payment.entity";
import { SalePaymentAmountPaidVO } from "../../domain/value-objects/sale-payment-amount-paid.vo";
import { SalePaymentReferenceNumberVO } from "../../domain/value-objects/sale-payment-reference-number.vo";
import { SalePaymentOrmEntity } from "../entities/sale-payment.orm-entity";
import { PaymentMethodMapper } from "src/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/mappers/payment-method.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";

export class SalePaymentMapper {
    static toDomain(ormEntity: SalePaymentOrmEntity): SalePaymentEntity{
        const domainEntity = SalePaymentEntity.reconstitute(
            ormEntity.salePaymentId,
            ormEntity.saleId,
            ormEntity.paymentMethodId,
            ormEntity.employeeId,
            SalePaymentAmountPaidVO.create(ormEntity.amountPaid),
            ormEntity.createdAt,
            SalePaymentReferenceNumberVO.create(ormEntity.referenceNumber),
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.sale? SaleMapper.toDomainEntity(ormEntity.sale): null,
            ormEntity.paymentMethod? PaymentMethodMapper.toDomainEntity(ormEntity.paymentMethod): null,
            ormEntity.employee? EmployeeMapper.toDomainEntity(ormEntity.employee): null
        );

        return domainEntity;
    }

    static toOrm(domainEntity: SalePaymentEntity): SalePaymentOrmEntity{
        const ormEntity: SalePaymentOrmEntity = {
            salePaymentId: domainEntity.salePaymentId,
            saleId: domainEntity.saleId,
            paymentMethodId: domainEntity.paymentMethodId,
            employeeId: domainEntity.employeeId,
            amountPaid: domainEntity.amountPaid.value,
            referenceNumber: domainEntity.referenceNumber?.value,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            sale: domainEntity.sale? SaleMapper.toTypeOrmEntity(domainEntity.sale): null,
            paymentMethod: domainEntity.paymentMethod? PaymentMethodMapper.toTypeOrmEntity(domainEntity.paymentMethod): null,
            employee: domainEntity.employee? EmployeeMapper.toOrmEntity(domainEntity.employee): null,
        };

        return ormEntity;
    }
}