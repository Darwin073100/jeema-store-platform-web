import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyQuantitySaleDetailRequestDto {
    @ApiProperty({ description: 'Cantidad del producto', minimum: 0.001, maximum: 999999.999 })
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
    @Min(0.001, { message: 'La cantidad mínima es 0.001' })
    @Max(999999.999, { message: 'La cantidad máxima es 999,999.999' })
    readonly quantity: number;
}
