import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";

export class ViewAllInventoryUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ){}

    async execute():Promise<[] | InventoryEntity[]>{
        const result = await this.inventoryRepository.findAll();
        return result;
    }
}