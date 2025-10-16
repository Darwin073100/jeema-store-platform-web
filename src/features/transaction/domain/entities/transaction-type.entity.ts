import { AccountTypeEnum } from "../enums/account-type.enum";
import { TransactionEntity } from "./transaction.entity";

export interface TransactionTypeEntity{
    transactionTypeId: bigint;
    name: string;
    description: string | null;
    accountType: AccountTypeEnum;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    transactions: TransactionEntity[];
}