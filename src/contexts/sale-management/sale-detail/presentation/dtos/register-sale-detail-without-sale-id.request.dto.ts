import { IsString, IsNotEmpty, IsNumber, IsOptional,IsPositive, Min, Max, MaxLength, IsNumberString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterSaleDetailWithoutSaleIdRequestDto {
    @ApiProperty({ description: 'ID del producto' })
    @IsNotEmpty({ message: 'El ID del producto es requerido' })
    @IsNumber({}, { message: 'El ID del producto debe ser un número' })
    readonly productId: number;

    @ApiProperty({ description: 'ID del inventario' })
    @IsNotEmpty({ message: 'El ID del inventario es requerido' })
    @IsNumber({}, { message: 'El ID del inventario debe ser un número' })
    readonly inventoryId: number;

    @ApiProperty({ description: 'Cantidad del producto', minimum: 0.001, maximum: 999999.999 })
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
    @Min(0.001, { message: 'La cantidad mínima es 0.001' })
    @Max(999999.999, { message: 'La cantidad máxima es 999,999.999' })
    readonly quantity: number;

    @ApiProperty({ description: 'Precio unitario del producto', minimum: 0.01, maximum: 9999999.99 })
    @IsNotEmpty({ message: 'El precio unitario es requerido' })
    @IsNumber({}, { message: 'El precio unitario debe ser un número' })
    @IsPositive({ message: 'El precio unitario debe ser mayor a 0' })
    @Min(0.01, { message: 'El precio unitario mínimo es 0.01' })
    @Max(9999999.99, { message: 'El precio unitario máximo es 9,999,999.99' })
    readonly unitPriceAtSale: number;

    @ApiProperty({ description: 'Precio regular del producto', minimum: 0.01, maximum: 9999999.99 })
    @IsNotEmpty({ message: 'El precio regular es requerido' })
    @IsNumber({}, { message: 'El precio regular debe ser un número' })
    @IsPositive({ message: 'El precio regular debe ser mayor a 0' })
    @Min(0.01, { message: 'El precio regular mínimo es 0.01' })
    @Max(9999999.99, { message: 'El precio regular máximo es 9,999,999.99' })
    readonly regularPriceAtSale: number;

    @ApiPropertyOptional({ description: 'Descuento del producto', minimum: 0, maximum: 9999999.99, default: 0 })
    @IsOptional()
    @IsNumber({}, { message: 'El descuento debe ser un número' })
    @Min(0, { message: 'El descuento mínimo es 0' })
    @Max(9999999.99, { message: 'El descuento máximo es 9,999,999.99' })
    readonly discountItem?: number = 0;

    @ApiProperty({ description: 'Nombre del producto en la venta', maxLength: 100 })
    @IsNotEmpty({ message: 'El nombre del producto es requerido' })
    @IsString({ message: 'El nombre del producto debe ser texto' })
    @MaxLength(100, { message: 'El nombre del producto no puede exceder los 100 caracteres' })
    readonly productNameAtSale: string;

    @ApiPropertyOptional({ description: 'Descripción del producto en la venta' })
    @IsOptional()
    @IsString({ message: 'La descripción del producto debe ser texto' })
    readonly productDescriptionAtSale?: string;

    @ApiProperty({ description: 'SKU del producto en la venta', maxLength: 50 })
    @IsNotEmpty({ message: 'El SKU del producto es requerido' })
    @IsString({ message: 'El SKU del producto debe ser texto' })
    @MaxLength(50, { message: 'El SKU del producto no puede exceder los 50 caracteres' })
    readonly productBarCodeAtSale: string;

    @ApiPropertyOptional({ description: 'Marca del producto en la venta', maxLength: 100 })
    @IsOptional()
    @IsString({ message: 'La marca del producto debe ser texto' })
    @MaxLength(100, { message: 'La marca del producto no puede exceder los 100 caracteres' })
    readonly productBrandAtSale?: string;

    @ApiPropertyOptional({ description: 'Categoría del producto en la venta', maxLength: 100 })
    @IsOptional()
    @IsString({ message: 'La categoría del producto debe ser texto' })
    @MaxLength(100, { message: 'La categoría del producto no puede exceder los 100 caracteres' })
    readonly productCategoryAtSale?: string;

    @ApiProperty({ description: 'Unidad de medida del producto en la venta', maxLength: 20 })
    @IsNotEmpty({ message: 'La unidad de medida del producto es requerida' })
    @IsString({ message: 'La unidad de medida debe ser texto' })
    @MaxLength(20, { message: 'La unidad de medida no puede exceder los 20 caracteres' })
    readonly productUnitAtSale: string;

    @ApiProperty({ description: 'Subtotal del detalle de venta', minimum: 0.01, maximum: 99999999.99 })
    @IsNotEmpty({ message: 'El subtotal es requerido' })
    @IsNumber({}, { message: 'El subtotal debe ser un número' })
    @IsPositive({ message: 'El subtotal debe ser mayor a 0' })
    @Min(0.01, { message: 'El subtotal mínimo es 0.01' })
    @Max(99999999.99, { message: 'El subtotal máximo es 99,999,999.99' })
    readonly subtotalItem: number;

    @ApiPropertyOptional({ description: 'Notas adicionales', maxLength: 500 })
    @IsOptional()
    @IsString({ message: 'Las notas deben ser texto' })
    @MaxLength(500, { message: 'Las notas no pueden exceder los 500 caracteres' })
    readonly notes?: string;
}
