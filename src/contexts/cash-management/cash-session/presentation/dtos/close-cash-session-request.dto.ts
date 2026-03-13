import { IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CloseCashSessionRequestDTO {
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sucursal es requerido.'})
    branchOfficeId: bigint;
    @IsNumberString({},{message: 'El id del empleado que va a aperturar debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado que va a aperturar es requerido.'})
    employeeId: bigint;
    @IsDateString({}, { message: 'La fecha de corte debe ser una fecha válida (YYYY-MM-DD).' })
    @IsNotEmpty({message: 'La fecha de corte es obligatorio.'})
    endTime: Date;
    @IsNumber({},{message: 'El monto esperado del corte de caja debe ser un numero entero o decimal.'})
    @IsNotEmpty({message: 'El monto esperado del corte es obligatoria.'})
    expectedBalance: number;
    @IsNumber({},{message: 'El monto actual del corte de caja debe ser un numero entero o decimal.'})
    @IsNotEmpty({message: 'El monto actual del corte es obligatoria.'})
    actualBalance: number;
    @IsNumber({},{message: 'La diferencia del corte de caja debe ser un numero entero o decimal.'})
    @IsNotEmpty({message: 'La diferencia del corte es obligatoria.'})
    diference: number;
    @IsOptional()
    @IsString({message: 'La nota del corte debe ser un texto.'})
    closingNotes?: string;
}