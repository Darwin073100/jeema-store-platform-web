import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { TransactionTypeEntity } from "../entities/transaction-type.entity";
import { AccountTypeEnum } from "../enums/account-type.enum";

export const TRANSACTION_TYPE_REPOSITORY = Symbol('TRANSACTION_TYPE_REPOSITORY');

export interface TransactionTypeRepository extends TemplateRepository<TransactionTypeEntity> {
    existById(entityId: bigint):Promise<boolean>;
    findByName(name: string): Promise<TransactionTypeEntity | null>;
    findAllByName(accountType: AccountTypeEnum): Promise<TransactionTypeEntity[]>;
}