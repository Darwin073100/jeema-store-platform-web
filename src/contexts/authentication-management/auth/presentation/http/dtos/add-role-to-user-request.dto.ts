import { IsNotEmpty, IsNumberString } from "class-validator";

export class AddRoleToUserRequestDTO{
    @IsNumberString({},{message: 'El id del usuario debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id del usuario es obligatorio.'})
    readonly userId: bigint;
    @IsNumberString({},{message: 'El id del rol debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id del rol es obligatorio.'})
    readonly roleId: bigint;
}