import { Result } from "@/shared/features/result";
import { TransactionEntity } from "../entities/transaction.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";

export interface TransactionRepository {
    save(dto: RegisterTransactionDTO): Promise<Result<TransactionEntity, ErrorEntity>>;
    findAllManyFilter(dto: ManyFilterTransactionsDTO): Promise<Result<{transactions: TransactionEntity[]}, ErrorEntity>>;
}