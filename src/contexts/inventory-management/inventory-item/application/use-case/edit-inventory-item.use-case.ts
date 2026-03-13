import { InventoryItemAlreadyExistException } from "../../domain/exceptions/inventory-item-already-exist.exception";
import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { EditInventoryItemDto } from "../dtos/edit-inventory-item.dto";

export class EditInventoryItemUseCase {
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
    ){}

    async execute(dto: EditInventoryItemDto){
        const itemExist = await this.inventoryItemRepository.findById(dto.inventoryItemId);
        
        if(!itemExist){
            throw new InventoryItemNotFoundException(`No encontramos el item de inventario.`);
        }

        // Si se quiere cambiar la ubicación
        if(!!dto.location){
            // Verificamos si ya existe un item con la nueva ubicación
            const stockDuplicated = await this.inventoryItemRepository.stockDuplicated(
                dto.inventoryItemId,
                dto.inventoryId,
                dto.location
            );

            if(stockDuplicated){
                throw new InventoryItemAlreadyExistException(
                    `Ya hay stock en la ubicacion (${dto.location}).`
                );
            }

            // Si no hay duplicados, actualizamos la ubicación
            // itemExist.updateLocation(dto.location);
        }

        // Actualizamos la cantidad si se proporciona
        if(dto.quantityOnHan){
            itemExist.updateQuantityOnHand(dto.quantityOnHan);
        }

        const result = await this.inventoryItemRepository.save(itemExist);
        return result;
    }
}