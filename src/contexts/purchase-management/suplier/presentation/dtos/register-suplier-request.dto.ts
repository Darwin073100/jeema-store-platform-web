import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { RegisterAddressRequestDTO } from "src/shared/presentation/http/dtos/register-address.resquest.dto";

/**
 * RegisterBranchOfficeRequestDto es un Data Transfer Object (DTO)
 * de la capa de Presentación. Se utiliza para la validación de las solicitudes HTTP
 * entrantes para el registro de un centro educativo.
 *
 * Contiene decoradores de 'class-validator' y '@nestjs/swagger' para la validación
 * y documentación automática de la API.
 */
export class RegisterSuplierRequestDto {
    @IsNotEmpty({message: 'El id del establecimiento es obligatorio.'})
    @IsNumberString({},{message: 'El id del establecimiento debe ser una cadena numerica.'})  
    establishmentId: bigint;
    @IsString({ message: 'El nombre no puede ser un número.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @MinLength(3, { message: 'El nombre debe tener como mínimo 3 caracteres.' })
    @MaxLength(150, { message: 'El nombre no debe ser mayor a 150 caracteres.' })
    name: string;
    @IsOptional()
    @IsString({ message: 'El número de teléfono es una cadena numerica.' })
    @MinLength(3, { message: 'El número de teléfono debe tener como mínimo 3 caracteres.' })
    @MaxLength(25, { message: 'El número de teléfono no debe ser mayor a 25 caracteres.' })
    phoneNumber?: string | null;
    @IsOptional()
    @IsString({ message: 'El RFC es una cadena alfanumerica.' })
    @MinLength(3, { message: 'El RFC debe tener como mínimo 3 caracteres.' })
    @MaxLength(13, { message: 'El RFC no debe ser mayor a 13 caracteres.' })
    rfc?: string | null;
    @IsOptional()
    @IsString({ message: 'El nombre de la persona de contacto es una cadena de texto.' })
    @MinLength(3, { message: 'El nombre de la persona de contacto debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El nombre de la persona de contacto no debe ser mayor a 100 caracteres.' })
    contactPerson?: string | null;
    @IsOptional()
    @IsEmail({},{ message: "El correo electrónico debe tener la estrcutura 'ejemplo@domain.com'" })
    @MinLength(3, { message: 'El correo electrónico debe tener como mínimo 3 caracteres.' })
    @MaxLength(100, { message: 'El correo electrónico no debe ser mayor a 100 caracteres.' })
    email?: string | null;
    @IsOptional()
    @IsString({ message: 'Las notas extras es una cadena de texto.' })
    @MinLength(3, { message: 'Las notas extras debe tener como mínimo 3 caracteres.' })
    @MaxLength(1000, { message: 'Las notas extras no debe ser mayor a 1000 caracteres.' })
    notes?: string | null;
    @IsOptional()
    @ValidateNested()
    @Type(() => RegisterAddressRequestDTO)
    address?: RegisterAddressRequestDTO | null;
  }