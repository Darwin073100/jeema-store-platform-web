import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserRequestDTO{
    @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
    public email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }) // Considera una longitud mínima más robusta en producción
    public password: string;
}