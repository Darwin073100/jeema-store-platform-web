import { IsNotEmpty, IsNumberString} from 'class-validator';

/**
 * DeleteBrandRequestDto es un Data Transfer Object (DTO)
 * de la capa de Presentación. Se utiliza para la validación de las solicitudes HTTP
 * entrantes para la eliminación de una marca.
 *
 * Contiene decoradores de 'class-validator' y '@nestjs/swagger' para la validación
 * y documentación automática de la API.
 */
export class DeleteBrandRequestDto {
  @IsNotEmpty({message: 'El ID de la marca es obligatorio.'})
  @IsNumberString({}, { message: 'El ID de la marca debe ser una cadena numerica.' })
  brandId: bigint;  
}