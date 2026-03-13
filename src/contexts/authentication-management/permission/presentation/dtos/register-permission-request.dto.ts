import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterPermissionRequestDto {
  @IsString({ message: 'El permiso no puede ser un número.' })
  @IsNotEmpty({ message: 'El permiso no puede estar vacío.' })
  @MinLength(3, { message: 'El permiso debe tener como mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'El permiso no debe ser mayor a 100 caracteres.' })
  name: string;
  @IsOptional()
  @IsString({ message: 'El permiso no puede ser un número.' })
  @MinLength(3, { message: 'El permiso debe tener como mínimo 3 caracteres.' })
  description?: string|null;
}