import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsDateString, IsNumberString } from "class-validator";

export class RegisterSeasonRequestDto {
  @IsNotEmpty({message: 'El ID del establecimeinto es obligatorio.'})
  @IsNumberString({}, { message: 'El ID del establecimeinto debe ser una cadena numerica.' })
  establishmentId: bigint;
  @IsString({ message: 'La temporada no puede ser un número.' })
  @IsNotEmpty({ message: 'La temporada no puede estar vacía.' })
  @MinLength(3, { message: 'La temporada debe tener como mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'La temporada no debe ser mayor a 100 caracteres.' })
  name: string;
  @IsOptional()
  @IsString({ message: 'La descripción no puede ser un número.' })
  @MinLength(3, { message: 'La descripción debe tener como mínimo 3 caracteres.' })
  description?: string | null;
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida.' })
  dateInit?: string | null;
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida.' })
  dateFinish?: string | null;
}
