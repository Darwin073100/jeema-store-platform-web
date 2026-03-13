import { IsNotEmpty, IsNumberString } from 'class-validator';

export class IdLotParamRequestDto {
  @IsNotEmpty({ message: 'El ID del lote es obligatorio.' })
  @IsNotEmpty({ message: 'El ID del lote es obligatorio.' })
  @IsNumberString({}, { message: 'El ID del lote debe ser una cadena numérica.' })
  lotId: bigint;
}
