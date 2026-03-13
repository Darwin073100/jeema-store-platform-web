import { IsNotEmpty, IsNumberString } from "class-validator";

export class DeletePaymentMethodRequestDto {
  @IsNotEmpty({message: 'El ID del metodo de pago es obligatorio.'})
  @IsNumberString({}, { message: 'El ID del metodo de pago debe ser una cadena numerica.' })
  paymentMethodId: bigint;
}