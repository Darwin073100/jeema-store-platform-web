import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export interface ITransactionType{
    transactionTypeId: bigint;
    name: string;
    description: string | null;
    accountType: AccountTypeEnum;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    transactions: any[];
}