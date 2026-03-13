import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";

export class RegisterTransactionTypeRequestDTO{
    @IsString({message: 'El nombre del típo de transacción debe ser una cadena de texto.'})
    @IsNotEmpty({message: 'El nombre del típo de transacción es obligatorio.'})
    @MinLength(100, {message: 'El nombre del típo de transacción debe tener máximo 100 caracteres.'})
    name: string;
    @IsOptional()
    @IsString({message: 'El nombre del típo de transacción debe ser una cadena de texto.'})
    description?: string | null;
    @IsEnum(AccountTypeEnum, { message: `El tipo de transaccion debe ser (${Object.values(AccountTypeEnum)}).`})
    accountType: AccountTypeEnum;
}