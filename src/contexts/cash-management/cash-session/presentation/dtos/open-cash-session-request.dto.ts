import { IsDateString, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class OpenCashSessionRequestDTO {
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sucursal es requerido.'})
    branchOfficeId: bigint;
    @IsNumberString({},{message: 'El id del empleado que va a aperturar debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado que va a aperturar es requerido.'})
    employeeId: bigint;
    @IsDateString({}, { message: 'La fecha de fabricación debe ser una fecha válida (YYYY-MM-DD).' })
    @IsNotEmpty({message: 'La fecha de apertura es obligatorio.'})
    startTime: Date;
    @IsNumber({},{message: 'El monto con el se va a aperurar caja debe ser un numero entero o decimal.'})
    @IsNotEmpty({message: 'La cantidad con la que se va a aperturar caja es obligatoria.'})
    startBalance: number;
}