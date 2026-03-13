import { IsBoolean, IsEmail,IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserRequestDTO {
    @IsBoolean({message: 'El valor para isActive debe ser booleano (true o false)'})
    @IsOptional()
    isActive?: boolean;

    @IsEmail({},{message: 'El correo electrónico debe ser una dirección de correo válida.',},)
    @IsOptional()
    @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
    email?: string;
    
    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
    username?: string;
    
    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }) // Una longitud mínima más segura
    password: string;
}
