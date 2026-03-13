import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterRoleRequestDto {
  @IsNumberString({},{message: 'El id del permiso es una cadena numerica.'})
  @IsNotEmpty({message: 'El id del permiso no puede estar vacío.'})
  permissionId: bigint;
  @IsString({ message: 'La categoria no puede ser un número.' })
  @IsNotEmpty({ message: 'La categoria no puede estar vacío.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  @MaxLength(50, { message: 'La categoria no debe ser mayor a 50 caracteres.' })
  name: string;
  @IsOptional()
  @IsString({ message: 'La categoria no puede ser un número.' })
  @MinLength(3, { message: 'La categoria debe tener como mínimo 3 caracteres.' })
  description?: string|null;
}