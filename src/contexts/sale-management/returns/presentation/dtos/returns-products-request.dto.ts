import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";

class Products {
    @IsNumberString({},{message: 'El id del detalle de venta es una cadena numérica.'})
    @IsNotEmpty({message: 'El id del detalle de venta es obligatorio'})
    saleDetailId: bigint;
    @IsNumberString({},{message: 'El id del inventario es una cadena numérica.'})
    @IsNotEmpty({message: 'El id del inventario es obligatorio'})
    inventoryId: bigint;
    @IsNumber({},{message: 'El monto a devolver debe ser número.'})
    @IsNotEmpty({message: 'El monto a devolver es obligatório.'})
    amountReturn: number;
    @IsNumber({},{message: 'La cantidad de producto a devolver debe ser número.'})
    @IsNotEmpty({message: 'La cantidad de producto a devolver es obligatório.'})
    quantityReturn: number;
    @IsString({message: 'La nota de la devolución debe ser una cadena numérica.'})
    @IsOptional()
    notes?: string | null;
}

export class ReturnsProductsRequestDTO {
    @IsNumberString({},{message: 'El id de la sucursal es una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sucursal es obligatorio'})
    branchOfficeId: bigint;
    @IsNumberString({},{message: 'El id del empleado es una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado es obligatorio'})
    employeeId: bigint;
    @IsNumberString({},{message: 'El id de la sesión abierta de caja es una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sesión abierta de caja es obligatorio'})
    cashSessionId: bigint;
    @IsNumberString({},{message: 'El id de la venta es una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la venta es obligatorio.'})
    saleId: bigint;
    @IsArray({ message: 'Los productos a devolver debe ser un arreglo.' })
    @ValidateNested({ each: true })
    @Type(() => Products)
    products: Products[]
}