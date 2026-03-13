import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCategoryRequestDto {
  @IsNotEmpty({message: 'El ID de la categoría es obligatorio.'})
  @IsNumberString({}, { message: 'El ID de la categoría debe ser una cadena numerica.' })
  categoryId: bigint;
  @IsOptional()
  @IsString({ message: 'La categoria no puede ser un número.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'La categoria no debe ser mayor a 250 caracteres.' })
  name?: string;
  @IsOptional()
  @IsString({ message: 'La categoria no puede ser un número.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  description?: string|null;
}