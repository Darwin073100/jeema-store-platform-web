import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsNumberString, ValidateNested, IsEnum } from 'class-validator';
import { RegisterLotUnitPurchaseWithoutIdRequestDTO } from './register-lot-unit-purchase-without-id-request.dto';
import { Type } from 'class-transformer';
import { ForSaleEnum } from 'src/shared/domain/enums/for-sale.enum';

export class RegisterLotRequestDto {
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
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RegisterLotUnitPurchaseWithoutIdRequestDTO)
  lotUnitPurchases?: RegisterLotUnitPurchaseWithoutIdRequestDTO[] | null;
}
