import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { LocationEnum } from "../../domain/enums/location.enum";
import { InventoryNotFoundException } from "src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception";

export class FindByLocationItemUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly itemRepository: InventoryItemRepository,
    ){}

    async execute(inventoryId: bigint, location: string | null ){
        try {
            const currentLocation = location? location: 'venta'
            const objLocation = Object.values(LocationEnum);
            const locationExist = await objLocation.find(item => item.trim().toLocaleLowerCase() === currentLocation.trim().toLowerCase());
            
            if(!locationExist){
                throw new InventoryNotFoundException(`La localizacion no existe, las opciones deben ser (${objLocation}).`);
            }

            const inventoryExist = await this.inventoryRepository.existById(inventoryId);
            if(!inventoryExist){
                throw new InventoryNotFoundException(`El inventario con ID(${inventoryId}) no existe.`);
            }

            const result = await this.itemRepository.findByLocation(inventoryId, currentLocation as LocationEnum);
            if(!result){
                throw new InventoryNotFoundException(`El inventario con ID(${inventoryId}) no tiene items en la ubicacion (${location}).`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}