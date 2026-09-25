import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InsufficientInventoryStockException } from "../../domain/exceptions/insufficient-inventory-stock.exception";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";

export class DiscountInventoryItemUseCase {
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
    ){}

    async execute(itemId: bigint, quantityOnHand: number){
        const itemExist = await this.inventoryItemRepository.findById(itemId);

        if(!itemExist){
            throw new InventoryItemNotFoundException(`No encontramos el item de inventario.`);
        }

        const availableQuantity: number = Number(itemExist.quantityOnHand.value);
        const currentQuantity: number = availableQuantity - quantityOnHand;

        if (currentQuantity < 0) {
            throw new InsufficientInventoryStockException(availableQuantity, quantityOnHand);
        }

        // Actualizamos la cantidad si se proporciona
        itemExist.updateQuantityOnHand(currentQuantity);

        const result = await this.inventoryItemRepository.save(itemExist);
        return result;
    }
}