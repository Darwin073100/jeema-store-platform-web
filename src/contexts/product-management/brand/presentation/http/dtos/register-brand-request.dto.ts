import { IsNotEmpty, IsNumberString, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

/**
 * RegisterBrandRequestDto es un Data Transfer Object (DTO)
 * de la capa de Presentación. Se utiliza para la validación de las solicitudes HTTP
 * entrantes para el registro de un establesimiento.
 *
 * Contiene decoradores de 'class-validator' y '@nestjs/swagger' para la validación
 * y documentación automática de la API.
 */
export class RegisterBrandRequestDto {
  @IsNotEmpty({message: 'El id del establecimiento es obligatorio.'})
  @IsNumberString({}, { message: 'El id del establecimiento debe ser una cadena numerica.' })
  establishmentId: bigint;
  @IsString({ message: 'El nombre de la marca no puede ser un número.' })
  @IsNotEmpty({ message: 'El nombre de la marca no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre de la marca debe tener como mínimo 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre de la marca no debe ser mayor a 100 caracteres.' })
  name: string;
}