import { IsNumberString, IsString } from "class-validator"

export class FindByLocationAndBranchOfficeQueryDTO{
    @IsString({message: 'La localizacion debe ser una cadena de texto.'})
    location: string;
    @IsNumberString({}, {message: 'El id de la sucursal debe ser una cadena numerica.'})
    branchOfficeId: bigint;
}