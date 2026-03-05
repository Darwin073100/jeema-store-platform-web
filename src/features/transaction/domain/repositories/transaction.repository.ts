import { Result } from "@/shared/features/result";
import { TransactionEntity } from "../entities/transaction.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";
import { TransactionTypeEntity } from "../entities/transaction-type.entity";
import { AccountTypeEnum } from "../enums/account-type.enum";

export interface TransactionRepository {
    save(dto: RegisterTransactionDTO): Promise<Result<TransactionEntity, ErrorEntity>>;
    findAllManyFilter(dto: ManyFilterTransactionsDTO): Promise<Result<{transactions: TransactionEntity[]}, ErrorEntity>>;
    findAllTransactionsType(accountType: AccountTypeEnum): Promise<Result<{transactionsType: TransactionTypeEntity[]}, ErrorEntity>>;
}