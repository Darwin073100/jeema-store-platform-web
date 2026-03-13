import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";

export class FindByInternalBarCodeInventoryUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ){}

    async execute(internalBarCode: string):Promise<InventoryEntity | null>{
        return this.inventoryRepository.findByInternalBarCode(internalBarCode);
    }
}