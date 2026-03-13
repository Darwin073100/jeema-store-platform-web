import { TransactionMapper } from "src/contexts/transaction-management/transaction/infraestructure/mappers/transaction.mapper";
import { TransactionTypeEntity } from "../../domain/entities/transaction-type.entity";
import { TransactionTypeOrmEntity } from "../entities/transaction-type.orm-entity";

export class TransactionTypeMapper {
    static toOrm(domainEntity: TransactionTypeEntity){
        const ormEntity: TransactionTypeOrmEntity = {
            transactionTypeId : domainEntity.transactionTypeId,
            name              : domainEntity.name,
            description       : domainEntity.description,
            accountType       : domainEntity.accountType,
            createdAt         : domainEntity.createdAt,
            updatedAt         : domainEntity.updatedAt,
            deletedAt         : domainEntity.deletedAt,
            transactions      : domainEntity.transactions? domainEntity.transactions.map(item => TransactionMapper.toOrm(item)): [],
        }
        return ormEntity;
    }

    static toDomain(ormEntity: TransactionTypeOrmEntity){
        const domainEntity = TransactionTypeEntity.reconstitute(
            ormEntity.transactionTypeId,
            ormEntity.name,
            ormEntity.description,
            ormEntity.accountType,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.transactions? ormEntity.transactions.map(item => TransactionMapper.toDomain(item)): [],
        );
        return domainEntity;
    }
}