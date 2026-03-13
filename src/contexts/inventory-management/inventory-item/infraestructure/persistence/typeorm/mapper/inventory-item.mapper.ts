import { InventoryItemOrmEntity } from "../entities/inventory-item.orm-entity";
import { InventoryItemQuantityOnHandVO } from "src/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo";
import { InventoryMapper } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/mapper/inventory.mapper";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";

export class InventoryItemMapper {
    static toDomain(ormEntity: InventoryItemOrmEntity){
        const domainEntity = InventoryItemEntity.reconstitute(
            ormEntity.inventoryItemId,
            ormEntity.inventoryId,
            ormEntity.location,
            InventoryItemQuantityOnHandVO.create(ormEntity.quantityOnHand),
            ormEntity.createdAt,
            ormEntity.inventory ? InventoryMapper.toDomain(ormEntity.inventory) : undefined,
            ormEntity.updatedAt,
            ormEntity.deletedAt
        );
        return domainEntity;
    }

    static toOrmEntity(domainEntity: InventoryItemEntity){
        const ormEntity = new InventoryItemOrmEntity();
        ormEntity.inventoryItemId = domainEntity.inventoryItemId;
        ormEntity.inventoryId = domainEntity.inventoryId;
        ormEntity.location = domainEntity.location;
        ormEntity.quantityOnHand = domainEntity.quantityOnHand.value;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.inventory = domainEntity.inventory? InventoryMapper.toOrmEntity(domainEntity.inventory): undefined;
        ormEntity.updatedAt = domainEntity.updatedAt;
        ormEntity.deletedAt = domainEntity.deletedAt;
        return ormEntity;
    }
}