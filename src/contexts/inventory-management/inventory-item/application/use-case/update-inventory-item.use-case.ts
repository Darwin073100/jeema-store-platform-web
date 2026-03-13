import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "../../domain/value-objects/inventory-item-quantity-on-hand.vo";
import { InventoryItemNotFoundException } from "../../domain/exceptions/inventory-item-not-found.exception";
import { InventoryCheckerPort } from "src/contexts/inventory-management/inventory/domain/port/out/inventory-ckecker.port";
import { UpdateInventoryItemDto } from "../dtos/update-inventory-item.dto";

export class UpdateInventoryItemUseCase{
    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly inventoryCheckerPort: InventoryCheckerPort,
    ){

    }

    async execute(dto: UpdateInventoryItemDto){
        // Verificar si el inventario existe
        const inventoryExists = await this.inventoryCheckerPort.exist(dto.inventoryId);
        if(!inventoryExists){
            throw new InventoryItemNotFoundException('El inventario establecido no existe.');
        }
        

        // PASAR LOS DATOS DEL DTO A LA ENTIDAD DE DOMINIO
        const inventoryItem = InventoryItemEntity.reconstitute(
            dto.inventoryItemId,
            dto.inventoryId,
            dto.location,
            InventoryItemQuantityOnHandVO.create(dto.quantityOnHan),
            new Date(),
        );

        // GUARDAR EN EL REPOSITORIO
        const savedInventoryItem = await this.inventoryItemRepository.save(inventoryItem);
        // DEVOLVER LA ENTIDAD GUARDADA
        return savedInventoryItem;
    }
}