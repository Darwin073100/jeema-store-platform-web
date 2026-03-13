import { InventoryRepository } from "../../domain/repositories/inventory.repository";

export class DeleteInventoryUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ){}

    async execute(id: bigint){
        const result = await this.inventoryRepository.delete(id);
        return result;
    }
}