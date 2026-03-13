import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";

export class RegisterLotUnitPurchaseRequestDTO{
    @IsNumber({maxDecimalPlaces: 2}, {message: 'El ID del lote debe ser un número con hasta 2 decimales.'})
    @IsNotEmpty({message: 'El precio es obligatorio'})
    purchasePrice: number;
    @IsNumber({maxDecimalPlaces: 3}, {message: 'La cantidad de compra debe ser un número con hasta 3 decimales.'})
    @IsNotEmpty({message: 'La cantidad de compra es obligatoria'})
    purchaseQuantity: number;
    @IsString({message: 'La unidad debe ser una cadena de texto.'})
    @IsEnum(ForSaleEnum, {message: 'La unidad debe ser un valor válido.'})
    @IsNotEmpty({message: 'La unidad es obligatoria'})
    unit: ForSaleEnum;
    @IsNumber({maxDecimalPlaces: 3}, {message: 'La Cantidad de unidades base debe ser un número con hasta 3 decimales.'})
    @IsNotEmpty({message: 'La Cantidad de unidades base es obligatoria'})
    unitsInPurchaseUnit: number;
}