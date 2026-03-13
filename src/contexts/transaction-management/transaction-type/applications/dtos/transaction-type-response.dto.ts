import { TransactionResponseDTO } from "src/contexts/transaction-management/transaction/application/dtos/transaction.response.dto";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export class TransactionTypeResponseDTO{
    transactionTypeId: bigint;
    name: string;
    description: string | null;
    accountType: AccountTypeEnum;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    transactions: TransactionResponseDTO[];
}