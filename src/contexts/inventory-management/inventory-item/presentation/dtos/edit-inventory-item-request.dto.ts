import { IsOptional, IsNumber, IsEnum } from "class-validator";
import { LocationEnum } from "../../domain/enums/location.enum";

export class EditInventoryItemRequestDTO{
    @IsOptional()
    @IsEnum(LocationEnum, {message: `Las opciones deben ser (${Object.values(LocationEnum)})`})
    location: LocationEnum; // Ubicación del inventario
    @IsOptional()
    @IsNumber({}, {message: 'La cantidad debe ser un número.'})
    quantityOnHand: number;
}