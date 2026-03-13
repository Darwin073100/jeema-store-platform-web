import { IsNotEmpty, IsNumberString, IsOptional, IsNumber, IsBoolean, IsPositive, IsString, MaxLength } from "class-validator";

export class UpdateInventoryRequestDTO{
    //  propiedades con class validators
    @IsNumberString({}, {message: 'El id del inventario debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del inventario no puede estar vacío.'})
    inventoryId: bigint;
    @IsNumberString({}, {message: 'El id del producto debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del producto no puede estar vacío.'})
    productId: bigint;
    @IsNumberString()
    @IsNotEmpty({message: 'El id de la sucursal no puede estar vacío.'})
    branchOfficeId: bigint; 
    @IsOptional()
    @IsString({message: 'El código de barras interno debe ser una cadena de texto.'})
    @MaxLength(100, {message: 'El código de barras interno no puede tener más de 100 caracteres.'})
    internalBarCode?: string;
    @IsOptional()
    @IsPositive({message: 'El precio de venta por menudeo debe ser positivo.'})
    @IsNumber({}, {message: 'El precio de venta unitario debe ser un número.'})
    salePriceOne?: number;
    @IsOptional()
    @IsPositive({message: 'El precio de venta por mayoreo debe ser positivo.'})
    @IsNumber({}, {message: 'El precio de venta por mayoreo debe ser un número.'})
    salePriceMany?: number;
    @IsOptional()
    @IsPositive({message: 'La cantidad de producto de venta por mayoreo debe ser positivo.'})
    @IsNumber({}, {message: 'La cantidad de producto de venta por mayoreo debe ser un número.'})
    saleQuantityMany?    : number | null;
    @IsOptional()
    @IsNumber({}, {message: 'El precio de venta especial debe ser un número.'})
    salePriceSpecial?    : number | null;
    @IsOptional()
    @IsNumber({}, {message: 'El stock mínimo debe ser un número.'})
    minStockBranch?: number;
    @IsOptional()
    @IsNumber({}, {message: 'El stock máximo debe ser un número.'})
    maxStockBranch?: number;
    @IsNotEmpty({message: 'Debe indicar si es vendible.'})
    @IsBoolean({message: 'El campo "es vendible" debe ser booleano.'})
    isSellable: boolean;
}