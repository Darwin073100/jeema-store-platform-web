import { IsEnum, IsNotEmpty } from "class-validator";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export class FindAllTransactionsTypeRequestDTO {
    @IsEnum(AccountTypeEnum, {message: `El típo de movimiento debe ser (${Object.create(AccountTypeEnum)})`})
    @IsNotEmpty({message: 'El típo de movimiento es obligatorio'})
    accountType: AccountTypeEnum;
}