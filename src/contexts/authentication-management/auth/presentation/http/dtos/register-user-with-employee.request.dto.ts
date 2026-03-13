import { IsEmail, IsEmpty, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserWithEmployeeRequestDTO {
    @IsNumberString()
    @IsNotEmpty({ message: 'El id de la sucursal no puede estar vacío.' })
    branchOfficeId: bigint;

    @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.', },)
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

    /** Nombre(s) */
    @IsString({message: 'El nombre debe ser una cadena de texto.'})
    @IsNotEmpty({message: 'El nombre es obligatorio.'})
    @MaxLength(100)
    firstName: string;

    /** Apellido(s) */
    @IsString({message: 'Los apellidos deben ser una cadena de texto.'})
    @IsNotEmpty({message: 'Los apellids son obligatorios.'})
    @MaxLength(100)
    lastName: string;

    /** Teléfono */
    @IsString({message: 'El teléfono debe ser una cadena de texto.'})
    @IsOptional()
    @MaxLength(20)
    phoneNumber?: string|null;
}
