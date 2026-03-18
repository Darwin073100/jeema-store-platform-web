import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { InventoryItemRegisterDto } from "../dtos/inventory-item-register.dto";
import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "../../domain/value-objects/inventory-item-quantity-on-hand.vo";
import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InventoryRepository } from "@/contexts/inventory-management/inventory/domain/repositories/inventory.repository";

export class RegisterInventoryItemUseCase{
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly inventoryCheckerPort: InventoryRepository,
    ){

    }

    async execute(dto: InventoryItemRegisterDto){
        // Verificar si el inventario existe
        const inventoryExists = await this.inventoryCheckerPort.existById(dto.inventoryId);
        if(!inventoryExists){
            throw new InventoryItemNotFoundException('El inventario establecido no existe.');
        }
        

        // PASAR LOS DATOS DEL DTO A LA ENTIDAD DE DOMINIO
        const inventoryItem = InventoryItemEntity.create(
            dto.inventoryId,
            dto.location,
            InventoryItemQuantityOnHandVO.create(dto.quantityOnHan),
        );

        // GUARDAR EN EL REPOSITORIO
        const savedInventoryItem = await this.inventoryItemRepository.save(inventoryItem);
        // DEVOLVER LA ENTIDAD GUARDADA
        return savedInventoryItem;
    }
}