import { Optional } from "@nestjs/common";
import { IsBoolean, IsNotEmpty, IsNumberString } from "class-validator";

export class FindAllSuplierByEstablishmentRequestDTO {
    @IsNotEmpty({message: 'El id del establecimiento es obligatorio.'})
    @IsNumberString({},{message: 'El id del establecimiento debe ser una cadena numerica.'})  
    establishmentId: bigint;
    @Optional()
    @IsBoolean({message: 'Debes ingresar true o false, para traer la dirección del proveedor.'})
    isAddress?: boolean | null;
}