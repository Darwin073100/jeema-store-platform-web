import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { SaleOrmEntity } from "../entities/sale.orm-entity";
import { CustomerMapper } from "src/contexts/sale-management/customer/infraestructure/persistence/typeorm/mappers/customer.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { SaleDetailMapper } from "src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/mappers/sale-detail.mapper";
import { SalePaymentMapper } from "src/contexts/sale-management/sale-payment/infraestructure/mappers/sale-payment.mapper";
import { TransactionMapper } from "src/contexts/transaction-management/transaction/infraestructure/mappers/transaction.mapper";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/infraestructure/mappers/cash-session.mapper";

export class SaleMapper {
    // Domain to TypeORM
    static toTypeOrmEntity(domainEntity: SaleEntity): SaleOrmEntity {
        const typeOrmEntity = new SaleOrmEntity();
        typeOrmEntity.saleId = domainEntity.saleId;
        typeOrmEntity.branchOfficeId = domainEntity.branchOfficeId;
        typeOrmEntity.customerId = domainEntity.customerId;
        typeOrmEntity.employeeId = domainEntity.employeeId;
        typeOrmEntity.cashSessionId = domainEntity.cashSessionId;
        typeOrmEntity.discountAmount = domainEntity.discountAmount;
        typeOrmEntity.subTotalAmount = domainEntity.subTotalAmount;
        typeOrmEntity.taxAmount = domainEntity.taxAmount;
        typeOrmEntity.totalAmount = domainEntity.totalAmount;
        typeOrmEntity.inAmount = domainEntity.inAmount;
        typeOrmEntity.outAmount = domainEntity.outAmount;
        typeOrmEntity.notes = domainEntity.notes;
        typeOrmEntity.status = domainEntity.status;
        typeOrmEntity.createdAt = domainEntity.createdAt;
        typeOrmEntity.updatedAt = domainEntity.updatedAt;
        typeOrmEntity.deletedAt = domainEntity.deletedAt;
        typeOrmEntity.branchOffice = domainEntity.branchOffice ? BranchOfficeMapper.toOrmEntity(domainEntity.branchOffice) : null;
        typeOrmEntity.customer = domainEntity.customer ? CustomerMapper.toOrmEntity(domainEntity.customer) : null;
        typeOrmEntity.employee = domainEntity.employee ? EmployeeMapper.toOrmEntity(domainEntity.employee) : null;
        typeOrmEntity.saleDetails = domainEntity.saleDetails? domainEntity.saleDetails.map(item => SaleDetailMapper.toOrmEntity(item)): null;
        typeOrmEntity.salePayments = domainEntity.salePayments? domainEntity.salePayments.map(item => SalePaymentMapper.toOrm(item)): null;
        typeOrmEntity.transactions = domainEntity.transactions? domainEntity.transactions.map(item => TransactionMapper.toOrm(item)): null;
        typeOrmEntity.cashSession = domainEntity.cashSession? CashSessionMapper.toOrm(domainEntity.cashSession): null;
        return typeOrmEntity;
    }

    // TypeORM to Domain
    static toDomainEntity(typeOrmEntity: SaleOrmEntity): SaleEntity {
        return SaleEntity.reconstitute(
            typeOrmEntity.saleId,
            typeOrmEntity.branchOfficeId,
            typeOrmEntity.customerId,
            typeOrmEntity.employeeId,
            typeOrmEntity.cashSessionId,
            typeOrmEntity.subTotalAmount,
            typeOrmEntity.discountAmount,
            typeOrmEntity.taxAmount,
            typeOrmEntity.totalAmount,
            typeOrmEntity.inAmount,
            typeOrmEntity.outAmount,
            typeOrmEntity.status,
            typeOrmEntity.notes,
            typeOrmEntity.createdAt,
            typeOrmEntity.updatedAt,
            typeOrmEntity.deletedAt,
            typeOrmEntity.transactions? typeOrmEntity.transactions.map( item => TransactionMapper.toDomain(item)): null,
            typeOrmEntity.branchOffice ? BranchOfficeMapper.toDomainEntity(typeOrmEntity.branchOffice): null,
            typeOrmEntity.customer ? CustomerMapper.toDomainEntity(typeOrmEntity.customer) : null,
            typeOrmEntity.employee ? EmployeeMapper.toDomainEntity(typeOrmEntity.employee) : null,
            typeOrmEntity.saleDetails? typeOrmEntity.saleDetails.map(item => SaleDetailMapper.toDomainEntity(item)): null,
            typeOrmEntity.salePayments? typeOrmEntity.salePayments.map(item => SalePaymentMapper.toDomain(item)): null,
            typeOrmEntity.cashSession? CashSessionMapper.toDomain(typeOrmEntity.cashSession): null,
        );
    }
}
