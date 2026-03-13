import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class FindCashSessionAllByBranchOfficeRequestDTO {
    @Type(() => Date)
    @IsDate({message: 'Debes ingresar la fecha de inicio valida para traer los cortes de caja.'})
    @IsNotEmpty({message: 'La fecha de inicio para traer los cortes de caja es obligatoria.' })
    dateInit: Date;
    @Type(() => Date) 
    @IsDate({message: 'Debes ingresar la fecha de final valida para traer los cortes de caja.'})
    @IsNotEmpty({message: 'La fecha de final para traer los cortes de caja es obligatoria.' })
    dateFinish: Date;
}