import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { EditInventoryItemDTO } from "../dtos/edit-inventory-item.dto";

export class AddStockLocationUseCase{
    constructor(
        private readonly repository: InventoryRepository
    ){}

    async execute(quantity: number, addQuantity: number, dto: Omit<EditInventoryItemDTO, 'quantityOnHand'>){
        const totalQuantity = Number(quantity) + Number(addQuantity);
        const currentItem: EditInventoryItemDTO = {
            inventoryId: dto.inventoryId,
            inventoryItemId: dto.inventoryItemId,
            location: dto.location,
            quantityOnHand: totalQuantity,
        }
        const result = await this.repository.editItem(currentItem);
        return result;
    }
}