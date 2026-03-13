import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export class RegisterTransactionTypeDTO{
    name: string;
    description: string | null;
    accountType: AccountTypeEnum;
}