import { IsNotEmpty, IsNumberString, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

/**
 * UpdateBrandRequestDto es un Data Transfer Object (DTO)
 * de la capa de Presentación. Se utiliza para la validación de las solicitudes HTTP
 * entrantes para la actualización de una marca.
 *
 * Contiene decoradores de 'class-validator' y '@nestjs/swagger' para la validación
 * y documentación automática de la API.
 */
export class UpdateBrandRequestDto {
  @IsNotEmpty({message: 'El ID de la marca es obligatorio.'})
  @IsNumberString({}, { message: 'El ID de la marca debe ser una cadena numerica.' })
  brandId: bigint;
  @IsString({ message: 'El nombre de la marca no puede ser un número.' })
  @IsNotEmpty({ message: 'El nombre de la marca no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre de la marca debe tener como mínimo 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre de la marca no debe ser mayor a 100 caracteres.' })
  name: string;
}