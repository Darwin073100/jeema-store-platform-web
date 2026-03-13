import { IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateUserRoleRequestDTO{
    @IsNumberString({},{message: 'El id de la relacion del usuario y el rol debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id de la relacion del usuario y el rol es obligatorio.'})
    readonly userRoleId: bigint;
    @IsNumberString({},{message: 'El id del rol debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id del rol es obligatorio.'})
    readonly roleId: bigint;
}