import { ArrayNotEmpty, IsArray, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SaleStatusEnum } from '../../domain/enums/sale-status.enum';
import { SalePaymentItem } from 'src/contexts/sale-management/sale-payment/presentation/dtos/register-sale-payment-request.dto';
import { Type } from 'class-transformer';

export class CalculateSaleRequestDto {
    @ApiProperty({ description: 'ID del cliente' })
    @IsNotEmpty({ message: 'El ID del cliente es requerido' })
    @IsNumberString({}, { message: 'El ID del cliente debe ser una cadena numerica.' })
    readonly customerId: bigint;
    @ApiProperty({ description: 'ID del empleado' })
    @IsNotEmpty({ message: 'El ID del empleado es requerido' })
    @IsNumberString({}, { message: 'El ID del empleado debe ser una cadena numerica.' })
    readonly employeeId: bigint;
    @ApiProperty({ description: 'ID de la caja' })
    @IsNotEmpty({ message: 'El ID de la caja es requerido' })
    @IsNumberString({}, { message: 'El ID de la caja debe ser una cadena numerica.' })
    readonly cashRegisterId: bigint;
    @IsNumber()
    @IsNotEmpty()
    readonly inAmount: number;
    @IsNotEmpty({message: `El status de la venta es obligatorio, (${Object.values(SaleStatusEnum).toString()}).`})
    @IsEnum(SaleStatusEnum, {message: `Los valores permitidos son (${Object.values(SaleStatusEnum).toString()}).`})
    readonly status: SaleStatusEnum;
    @IsOptional()
    @IsString({message: 'Las notas deben ser una cadena de caracteres'})
    readonly notes?: string | null;
    @IsOptional()
    @IsArray({message: 'Los pagos de la venta debe ser un array.'})
    @ArrayNotEmpty({message: 'Debes enviar por lo menos un metodo de pago.'})
    @ValidateNested({each: true})
    @Type(() => SalePaymentItem)
    readonly salePayments?: SalePaymentItem[];
}