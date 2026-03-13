import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class FindReportLotsRequestDTO {
    @Type(() => Date)
    @IsDate({message: 'Debes ingresar la fecha de inicio valida para traer los lotes de compra.'})
    @IsNotEmpty({message: 'La fecha de inicio para traer los lotes de compra es obligatoria.' })
    dateInit: Date;
    @Type(() => Date) 
    @IsDate({message: 'Debes ingresar la fecha de final valida para traer los lotes de compra.'})
    @IsNotEmpty({message: 'La fecha de final para traer los lotes de compra es obligatoria.' })
    dateFinish: Date;
}