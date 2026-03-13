import { CashRegisterMapper } from "src/contexts/cash-management/cash-register/infraestructure/mappers/cash-register.mapper";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { CashSessionOrmEntity } from "../entities/cash-session.orm-entity";
import { EmployeeMapper } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/mappers/employee.mapper";
import { TransactionMapper } from "src/contexts/transaction-management/transaction/infraestructure/mappers/transaction.mapper";
import { SaleMapper } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/mappers/sale.mapper";

export class CashSessionMapper {
    static toDomain(ormEntity: CashSessionOrmEntity){
        const domainEntity = CashSessionEntity.reconstitute(
            ormEntity.cashSessionId,
            ormEntity.cashRegisterId,
            ormEntity.employeeId,
            ormEntity.startTime,
            ormEntity.startBalance,
            ormEntity.endTime,
            ormEntity.expectedBalance,
            ormEntity.actualBalance,
            ormEntity.diference,
            ormEntity.isClosed,
            ormEntity.closingNotes,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.cashRegister? CashRegisterMapper.toDomain(ormEntity.cashRegister): null,
            ormEntity.employee? EmployeeMapper.toDomainEntity(ormEntity.employee): null,
            ormEntity.transactions? ormEntity.transactions.map(item => TransactionMapper.toDomain(item)): null,
            ormEntity.sales? ormEntity.sales.map(sale => SaleMapper.toDomainEntity(sale)): null,
        );
        return domainEntity;
    }

    static toOrm(domainEntity: CashSessionEntity){
        const ormEntity: CashSessionOrmEntity = {
            cashSessionId: domainEntity.cashSessionId,
            cashRegisterId: domainEntity.cashRegisterId,
            employeeId: domainEntity.employeeId,
            startTime: domainEntity.startTime,
            startBalance: domainEntity.startBalance,
            endTime: domainEntity.endTime,
            expectedBalance: domainEntity.expectedBalance,
            actualBalance: domainEntity.actualBalance,
            diference: domainEntity.diference,
            isClosed: domainEntity.isClosed,
            closingNotes: domainEntity.closingNotes,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            cashRegister: domainEntity.cashRegister? CashRegisterMapper.toOrm(domainEntity.cashRegister): null,
            employee: domainEntity.employee? EmployeeMapper.toOrmEntity(domainEntity.employee): null,
            transactions: domainEntity.transactions? domainEntity.transactions.map( item => TransactionMapper.toOrm(item)): null,
            sales: domainEntity.sales? domainEntity.sales.map( sale => SaleMapper.toTypeOrmEntity(sale)): null,
        }
        return ormEntity;
    }
}