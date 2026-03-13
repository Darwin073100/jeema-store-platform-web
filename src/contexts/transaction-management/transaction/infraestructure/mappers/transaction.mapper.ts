import { TransactionTypeMapper } from "src/contexts/transaction-management/transaction-type/infraestructure/mappers/transaction-type.mapper";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionOrmEntity } from "../entities/transaction.orm-entity";
import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/infraestructure/mappers/cash-session.mapper";

export class TransactionMapper {
    public static toDomain(ormEntity: TransactionOrmEntity){
        return TransactionEntity.reconstitute(
            ormEntity.transactionId,
            ormEntity.transactionTypeId,
            ormEntity.branchOfficeId,
            ormEntity.purchaseId,
            ormEntity.saleId,
            ormEntity.employeeId,
            ormEntity.cashSessionId,
            ormEntity.amount,
            ormEntity.description,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.transactionType? TransactionTypeMapper.toDomain(ormEntity.transactionType): null,
            ormEntity.branchOffice? BranchOfficeMapper.toDomainEntity(ormEntity.branchOffice): null,
            ormEntity.sale? SaleMapper.toDomainEntity(ormEntity.sale): null,
            ormEntity.employee? EmployeeMapper.toDomainEntity(ormEntity.employee): null,
            ormEntity.cashSession? CashSessionMapper.toDomain(ormEntity.cashSession): null,
        );
    }

    public static toOrm(domainEntity: TransactionEntity){
        const ormEntity: TransactionOrmEntity = {
            transactionId: domainEntity.transactionId,
            transactionTypeId: domainEntity.transactionTypeId,
            branchOfficeId: domainEntity.branchOfficeId,
            purchaseId: domainEntity.purchaseId,
            saleId: domainEntity.saleId,
            employeeId: domainEntity.employeeId,
            cashSessionId: domainEntity.cashSessionId,
            amount: domainEntity.amount,
            description: domainEntity.description,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            transactionType: domainEntity.transactionType? TransactionTypeMapper.toOrm(domainEntity.transactionType): null,
            branchOffice: domainEntity.branchOffice? BranchOfficeMapper.toOrmEntity(domainEntity.branchOffice): null,
            sale: domainEntity.sale? SaleMapper.toTypeOrmEntity(domainEntity.sale): null,
            employee: domainEntity.employee? EmployeeMapper.toOrmEntity(domainEntity.employee): null,
            cashSession: domainEntity.cashSession? CashSessionMapper.toOrm(domainEntity.cashSession): null,
        };
        return ormEntity;
    }
}