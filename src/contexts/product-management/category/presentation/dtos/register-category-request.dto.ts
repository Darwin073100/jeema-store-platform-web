import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterCategoryRequestDto {
  @IsNotEmpty({message: 'El ID del establecimiento es obligatorio.'})
  @IsNumberString({}, { message: 'El ID del establecimiento debe ser una cadena numerica.' })
  establishmentId: bigint;
  @IsString({ message: 'La categoria no puede ser un número.' })
  @IsNotEmpty({ message: 'La categoria no puede estar vacío.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'La categoria no debe ser mayor a 250 caracteres.' })
  name: string;
  @IsOptional()
  @IsString({ message: 'La categoria no puede ser un número.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  description?: string|null;
}