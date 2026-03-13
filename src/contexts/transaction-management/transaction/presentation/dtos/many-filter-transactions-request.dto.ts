import { IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class ManyFilterTransactionsRequestDTO{
    @IsNumberString({},{message: 'El id del establecimiento debe ser una cadena numérica'})
    @IsNotEmpty({message: 'El id del establecimiento es obligatorio.'})
    establishmentId: bigint;
    @IsOptional()
    @IsDateString({}, { message: 'Fecha inicial debe ser una fecha válida (YYYY-MM-DD).' })
    dateInit?: Date | null;
    @IsOptional()
    @IsDateString({}, { message: 'Fecha límite debe ser una fecha válida (YYYY-MM-DD).' })
    dateEnd?: Date | null;
    @IsOptional()
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica'})
    branchOfficeId?: bigint | null;
    @IsOptional()
    @IsNumberString({},{message: 'El id del empleado debe ser una cadena numérica'})
    employeeId?: bigint | null;
    @IsOptional()
    @IsNumberString({},{message: 'El id de caja debe ser una cadena numérica'})
    cashSessionId?: bigint | null;
    @IsOptional()
    @IsNumberString({},{message: 'El id de la venta debe ser una cadena numérica'})
    saleId?: bigint | null;
    @IsOptional()
    @IsString({message: 'El tipo de transaccion es una cadena'})
    transactionType?: string | null;
}