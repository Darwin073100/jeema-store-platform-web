import { IsNotEmpty, IsNumberString } from "class-validator";

export class DeleteSeasonRequestDto {
  @IsNotEmpty({message: 'El ID de la temporada es obligatorio.'})
  @IsNumberString({}, { message: 'El ID de la temporada debe ser una cadena numerica.' })
  seasonId: bigint;
}
