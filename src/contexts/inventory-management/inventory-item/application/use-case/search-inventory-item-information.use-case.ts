import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { LocationEnum } from "../../domain/enums/location.enum";

export class SearchInventoryItemInformationUseCase {
    constructor(
        private readonly itemRepository: InventoryItemRepository,
    ) { }

    async execute(inventoryId: bigint, barcode: string) {
        const location = LocationEnum.SALE;
        const result = await this.itemRepository.searchInventoryItemInformation(inventoryId, barcode, location);
        return result;
    }
}