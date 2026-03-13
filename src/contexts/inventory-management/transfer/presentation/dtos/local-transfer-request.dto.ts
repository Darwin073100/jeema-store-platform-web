import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";

export class LocalTransferRequestDTO{
    @IsNumberString({},{message: 'El id del inventario debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del inventario es obligatorio.'})
    inventoryId: bigint;
    @IsEnum(LocationEnum, {message: `LEl origen del traspaso debe ser (${Object.values(LocationEnum)}).`})
    @IsNotEmpty({message: 'El origen del traspaso es obligatorio.'})
    fromLocation: LocationEnum;
    @IsNumberString({},{message: 'El id de la sucursal debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id de la sucursal es obligatorio.'})
    branchOfficeId: bigint;
    @IsEnum(LocationEnum, {message: `El destino del traspaso debe ser (${Object.values(LocationEnum)}).`})
    @IsNotEmpty({message: 'El destino del traspaso es obligatorio.'})
    toLocation: LocationEnum;
    @IsNumber({},{message: 'La cantidad a traspasar debe ser un número.'})
    @IsNotEmpty({message: 'La cantidad a traspasar es obligatoria.'})
    quantity: number
    @IsNumberString({},{message: 'El id del empleado debe ser una cadena numérica.'})
    @IsNotEmpty({message: 'El id del empleado es obligatorio.'})
    requestedByEmployeeId: bigint;
    @IsString({message: 'Las notas debe ser una cadena de texto.'})
    @IsOptional()
    notes: string | null;
}