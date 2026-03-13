import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Max, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SalePaymentItem {
    @ApiProperty({ description: 'ID de método de pago' })
    @IsNotEmpty({ message: 'El ID de método de pago es requerido' })
    @IsNumberString({}, { message: 'El ID de método de pago debe ser una cadena numerica.' })
    readonly paymentMethodId: bigint;
    @IsNumber({}, {message: 'El monto a pagar debe ser un numero.'})
    @IsNotEmpty({message: 'El monto a pagar es requerido.'})
    readonly amountPaid: number;
    @IsOptional()
    @IsString({message: 'El número de referencia debe ser una cadena alfanumérica.'})
    readonly referenceNumber?: string| null;
}

export class RegisterSalePaymentRequestDto {
    // @ApiProperty({ description: 'ID de la sventa' })
    // @IsNotEmpty({ message: 'El ID de la venta es requerido' })
    // @IsNumberString({}, { message: 'El ID de la venta debe ser una cadena numerica.' })
    // readonly saleId: bigint;
    @IsNotEmpty({message: 'Debes enviar por lo menos un metodo de pago.'})
    @IsArray({message: 'Los pagos de la venta debe ser un array.'})
    @ArrayNotEmpty({message: 'Debes enviar por lo menos un metodo de pago.'})
    @ValidateNested({each: true})
    @Type(() => SalePaymentItem)
    readonly methods: SalePaymentItem[]
}