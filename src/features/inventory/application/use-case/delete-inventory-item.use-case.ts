import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";

export class DeleteInventoryItemUseCase{
    constructor(
        private readonly repository: InventoryItemRepository
    ){}

    async execute(entityId: bigint){
        const result = await this.repository.deleteById(entityId);
        return result;
    }
}