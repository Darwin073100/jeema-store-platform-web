import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";

export class ViewAllInventoryItemUseCase {
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository
    ){}

    async execute():Promise<[] | InventoryItemEntity[]>{
        const result = await this.inventoryItemRepository.findAll();
        return result;
    }
}