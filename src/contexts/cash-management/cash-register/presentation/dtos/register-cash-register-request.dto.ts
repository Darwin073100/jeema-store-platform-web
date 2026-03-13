import { IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterCashRegisterRequestDTO {
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id de la sucursal es obligatorio.'})
    branchOfficeId: bigint;
    @IsString({message: 'El nombre de la caja debe ser una cadena de texto.'})
    @MinLength(3, {message: 'El nombre de la casa debe ser mayor a 3 caracteres.'})
    @MaxLength(150, {message: 'El nombre de la casa debe ser menor a 150 caracteres.'})
    name: string;
}