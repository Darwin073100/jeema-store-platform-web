import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsNumber, IsBoolean, IsDateString, MaxLength, IsPositive } from "class-validator";
import { LocationEnum } from "../../domain/enums/location.enum";

export class InventoryItemWithoutInventoryRequestDTO{
    @IsNotEmpty({message: 'La ubicación no puede estar vacía.'})
    location: LocationEnum; // Ubicación del inventario
    @IsOptional()
    @IsString({message: 'El código de barras interno debe ser una cadena de texto.'})
    @MaxLength(100, {message: 'El código de barras interno no puede tener más de 100 caracteres.'})
    internalBarCode?: string;
    @IsNotEmpty({message: 'La cantidad no puede estar vacía.'})
    @IsNumber({}, {message: 'La cantidad debe ser un número.'})
    quantityOnHand: number;
    @IsNotEmpty({message: 'El precio de compra no puede estar vacío.'})
    @IsNumber({}, {message: 'El precio de compra debe ser un número.'})
    purchasePriceAtStock: number;
    @IsOptional()
    @IsDateString(undefined, {message: 'La fecha de último abastecimiento debe ser una fecha válida.'})
    lastStockedAt?: string;
}