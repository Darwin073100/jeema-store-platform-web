import { IsNotEmpty, IsNumberString } from "class-validator";

export class DeleteInventoryItemRequestDTO{
    @IsNumberString({},{message: 'El id del item de inventario debe ser una cadena numerica.'})
    @IsNotEmpty({message: 'El id del item de inventario no puede estar vacío.'})
    inventoryItemId: string;
}