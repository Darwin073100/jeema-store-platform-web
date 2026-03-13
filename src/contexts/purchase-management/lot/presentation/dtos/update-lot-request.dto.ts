import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsNumberString, IsEnum } from 'class-validator';
import { ForSaleEnum } from 'src/shared/domain/enums/for-sale.enum';

export class UpdateLotRequestDto {
  @IsNotEmpty({ message: 'El ID del lote es obligatorio.' })
  @IsNumberString({}, { message: 'El ID del lote debe ser una cadena numérica.' })
  lotId: bigint;

  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  @IsNumberString({}, { message: 'El ID del producto debe ser una cadena numérica.' })
  productId: bigint;
  @IsOptional()
  @IsNumberString({}, { message: 'El ID del proveedor debe ser una cadena numérica.' })
  suplierId?: bigint | null;
  @IsNotEmpty({ message: 'El número de lote es obligatorio.' })
  @IsString({ message: 'El número de lote debe ser una cadena de texto.' })
  lotNumber: string;

  @IsNotEmpty({ message: 'El precio de compra es obligatorio.' })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'El precio de compra debe ser un número con hasta 4 decimales.' })
  purchasePrice: number;

  @IsNotEmpty({ message: 'La cantidad inicial es obligatoria.' })
  @IsNumber({ maxDecimalPlaces: 3 }, { message: 'La cantidad inicial debe ser un número con hasta 3 decimales.' })
  initialQuantity: number;

  @IsNotEmpty({ message: 'La unidad de compra es obligatoria.' })
  @IsEnum(ForSaleEnum, { message: 'La unidad de compra debe ser un valor válido.' })
  purchaseUnit: ForSaleEnum;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de caducidad debe ser una fecha válida (YYYY-MM-DD).' })
  expirationDate?: Date | null;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fabricación debe ser una fecha válida (YYYY-MM-DD).' })
  manufacturingDate?: Date | null;

  @IsDateString({}, { message: 'La fecha de recepción debe ser una fecha válida (YYYY-MM-DD).' })
  receivedDate: Date;
}
