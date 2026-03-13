import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { TransactionEntity } from "../entities/transaction.entity";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionRepository extends TemplateRepository<TransactionEntity> {
    findAllByManyFilter(dto: ManyFilterTransactionsDTO): Promise<TransactionEntity[]>;
}