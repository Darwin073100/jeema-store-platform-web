import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString } from "class-validator";

export class RegisterTransactionSaleRequestDTO{
    @IsNumberString({},{message: 'El id del tipo de transacción debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del tipo de transacción es requerido.'})
    transactionTypeId : bigint;
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sucursal es requerido.'})
    branchOfficeId    : bigint;
    @IsNumberString({},{message: 'El id de la venta debe ser una cadena numérica.'})
    @IsOptional()
    saleId            ?: bigint | null;
    @IsNumberString({},{message: 'El id de la compra debe ser una cadena numérica.'})
    @IsOptional()
    purchaseId            ?: bigint | null;
    @IsNumberString({},{message: 'El id del empleado debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado es requerido.'})
    employeeId        : bigint;
    @IsNotEmpty({message: 'El monto de la transaccion es requerido'})
    @IsPositive({message: 'El monto de la transaccion debe ser positivo.'})
    @IsNumber({}, {message: 'El monto de la transaccion debe ser un número.'})
    amount            : number;
    @IsOptional()
    @IsString({message: 'La descripción debe ser una cadena de texto.'})
    description       ?: string | null;
}