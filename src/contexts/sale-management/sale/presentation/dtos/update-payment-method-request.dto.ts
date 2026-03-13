import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePaymentMethodRequestDto {
  @IsNotEmpty({message: 'El ID del metodo de pago es obligatorio.'})
  @IsNumberString({}, { message: 'El ID del metodo de pago debe ser una cadena numerica.' })
  paymentMethodId: bigint;
  @IsString({ message: 'El metodo de pago no puede ser un número.' })
  @IsNotEmpty({ message: 'El metodo de pago no puede estar vacío.' })
  @MinLength(3, { message: 'El metodo de pago debe tener como mínimo 3 caracteres.' })
  @MaxLength(50, { message: 'El metodo de pago no debe ser mayor a 50 caracteres.' })
  name: string;
  @IsOptional()
  @IsBoolean({ message: 'El metodo de pago debe ser un valor boleano (true-false)' })
  requiresReference: boolean;
}