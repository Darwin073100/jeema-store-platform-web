import { IsEmail, IsNotEmpty, IsNumberString, IsString, MinLength } from "class-validator";

export class RegisterUserRequestDTO {
    @IsNumberString({},{message: 'El id del empleado debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado no puede estar vacío.'})
    employeeId: bigint;

    @IsNumberString()
    @IsNotEmpty({message: 'El id del rol no puede estar vacío.'})
    roleId: bigint;

    @IsEmail({},{message: 'El correo electrónico debe ser una dirección de correo válida.',},)
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
    email: string;

    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
    username: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }) // Una longitud mínima más segura
    password: string;
}
