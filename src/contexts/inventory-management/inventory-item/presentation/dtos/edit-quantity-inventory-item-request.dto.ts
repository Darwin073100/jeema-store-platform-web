import { IsOptional, IsNumber, IsEnum, IsNotEmpty } from "class-validator";

export class EditQuantityInventoryItemRequestDTO{
    @IsOptional()
    @IsNotEmpty({message: 'La cantidad es obligatoria.'})
    @IsNumber({}, {message: 'La cantidad debe ser un número.'})
    quantityOnHand: number;
}