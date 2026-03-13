import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";

export class AddInventoryItemUseCase {
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
    ){}

    async execute(itemId: bigint, quantityOnHand: number){
        const itemExist = await this.inventoryItemRepository.findById(itemId);
        
        if(!itemExist){
            throw new InventoryItemNotFoundException(`No encontramos el item de inventario.`);
        }

        const currentQuantity: number = Number(itemExist.quantityOnHand.value) + quantityOnHand;

        // Actualizamos la cantidad si se proporciona
        itemExist.updateQuantityOnHand(currentQuantity);

        const result = await this.inventoryItemRepository.save(itemExist);
        return result;
    }
}