import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate, IsDateString } from 'class-validator';

export class LotRequestDto {
  @IsNotEmpty()
  @IsNumber()
  productId: bigint;

  @IsNotEmpty()
  @IsString()
  lotNumber: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  purchasePrice: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 3 })
  initialQuantity: number;

  @IsOptional()
  @IsDateString()
  expirationDate?: string | null;

  @IsOptional()
  @IsDateString()
  manufacturingDate?: string | null;

  @IsOptional()
  @IsDateString()
  receivedDate?: string | null;
}
