import { Result } from "@/shared/features/result";
import { TransactionEntity } from "../entities/transaction.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";

export interface TransactionRepository {
    save(dto: RegisterTransactionDTO): Promise<Result<TransactionEntity, ErrorEntity>>
}