import { IsString, IsNotEmpty, IsNumber, IsOptional,IsPositive, Min, Max, MaxLength, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleForEnum } from '../../domain/enums/sale-for.enum';

export class RegisterSaleDetailRequestDto {
    @ApiProperty({ description: 'Cantidad del producto', minimum: 0.001, maximum: 999999.999 })
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
    @Min(0.001, { message: 'La cantidad mínima es 0.001' })
    @Max(999999.999, { message: 'La cantidad máxima es 999,999.999' })
    readonly quantity: number;
    @IsOptional()
    @IsNumber({}, { message: 'El precio especial debe ser un número' })
    @IsPositive({ message: 'El precio especial debe ser mayor a 0' })
    @Max(9999999.99, { message: 'El precio especial máximo es 9,999,999.99' })
    readonly specialPrice?: number | null;
    @ApiProperty({ description: 'código de barras del producto en la venta', maxLength: 50 })
    @IsNotEmpty({ message: 'El código de barras del producto es requerido' })
    @IsString({ message: 'El código de barras del producto debe ser texto' })
    @MaxLength(50, { message: 'El código de barras del producto no puede exceder los 50 caracteres' })
    readonly productBarCodeAtSale: string;
    @ApiProperty({ description: 'Unidad de medida del producto en la venta', maxLength: 20 })
    @IsNotEmpty({ message: 'La unidad de medida del producto es requerida' })
    @IsString({ message: 'La unidad de medida debe ser texto' })
    @MaxLength(20, { message: 'La unidad de medida no puede exceder los 20 caracteres' })
    readonly productUnitAtSale: string;
    @IsEnum(SaleForEnum, {message: `Debes enviar una opcion valida, (${Object.values(SaleForEnum).toString()})`})
    readonly saleFor: SaleForEnum
    @ApiPropertyOptional({ description: 'Notas adicionales', maxLength: 500 })
    @IsOptional()
    @IsString({ message: 'Las notas deben ser texto' })
    @MaxLength(500, { message: 'Las notas no pueden exceder los 500 caracteres' })
    readonly notes?: string;
}
