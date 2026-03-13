import { IsNotEmpty, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

/**
 * RegisterEmployeeRoleRequestDto es un Data Transfer Object (DTO)
 * de la capa de Presentación. Se utiliza para la validación de las solicitudes HTTP
 * entrantes para el registro de un establesimiento.
 *
 * Contiene decoradores de 'class-validator' y '@nestjs/swagger' para la validación
 * y documentación automática de la API.
 */
export class RegisterEmployeeRoleRequestDto {
  // @ApiProperty({
  //   description: 'El nombre de un establesimiento',
  //   example: 'Awesome Learning Academy',
  //   maxLength: 250,
  // })
  @IsString({ message: 'El nombre del rol para empledos debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del rol para empledos no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre del rol para empledos debe tener como mínimo 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre del rol para empledos no debe ser mayor a 100 caracteres.' })
  name: string;
}