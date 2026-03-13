import { IsNotEmpty, IsNumberString } from "class-validator";

export class DeleteCategoryRequestDto {
  @IsNotEmpty({message: 'El ID de la categoría es obligatorio.'})
  @IsNumberString({}, { message: 'El ID de la categoría debe ser una cadena numerica.' })
  categoryId: bigint;
}