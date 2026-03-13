import { DataSource, Not, Or, Repository } from "typeorm";
import { InventoryItemOrmEntity } from "../entities/inventory-item.orm-entity";
import { Inject, Injectable } from "@nestjs/common";
import { InventoryItemMapper } from "../mapper/inventory-item.mapper";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { InventoryItemAlreadyExistException } from "src/contexts/inventory-management/inventory-item/domain/exceptions/inventory-item-already-exist.exception";
import { InventoryItemNotFoundException } from "src/contexts/inventory-management/inventory-item/domain/exceptions/inventory-item-not-found.exception";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";

@Injectable()
export class TypeormInventoryItemRepository implements InventoryItemRepository {
    private readonly inventoryItemRepository: Repository<InventoryItemOrmEntity>;

    constructor(
        private readonly datasource: DataSource,
        @Inject(CONNECTION_DB_REPOSITORIO)
        private readonly connection: ConnectionDBRepository
    ) {
        this.inventoryItemRepository = this.datasource.getRepository(InventoryItemOrmEntity);
    }

    /** 
     * Guarda un item de inventario, en caso de encontrar un registro lo actualiza.
     * @param {InventoryItemEntity} entity Entidad a persistir
     * @returns {Promise<InventoryItemEntity>} Retorna una promesa con la entidad persistida. 
    */
    async save(entity: InventoryItemEntity): Promise<InventoryItemEntity> {
        let inventoryItemExist = await this.inventoryItemRepository.findOne({
            where: {
                inventoryItemId: entity.inventoryItemId
            }
        });

        if (inventoryItemExist) {
            inventoryItemExist = {
                ...inventoryItemExist,
                location: entity.location,
                quantityOnHand: entity.quantityOnHand.value,
            }
            // Se encarga de que a la hora de actualizar un registro no haya location duplicadas 
            // el inventario de un producto
            const stockDuplicated = await this.inventoryItemRepository.findOne({
                where: {
                    location: inventoryItemExist.location,
                    inventoryItemId: Not(inventoryItemExist.inventoryItemId),
                    inventoryId: inventoryItemExist.inventoryId
                }
            });

            if (stockDuplicated) {
                throw new InventoryItemAlreadyExistException(`Ya hay stock en la ubicacion (${inventoryItemExist.location}).`);
            }
            const updateResult = await this.connection.getManager().save(InventoryItemOrmEntity, inventoryItemExist);
            return InventoryItemMapper.toDomain(updateResult);
        }
        const isExist = await this.findByLocation(entity.inventoryId, entity.location)
        if (isExist) {
            throw new InventoryItemAlreadyExistException(`Ya hay stock en la ubicacion (${entity.location}).`);
        }
        const ormEntity = InventoryItemMapper.toOrmEntity(entity);
        const result = await this.connection.getManager().save(InventoryItemOrmEntity, ormEntity);
        return InventoryItemMapper.toDomain(result);
    }

    async update(entity: InventoryItemEntity): Promise<InventoryItemEntity> {
        try {
            // Buscamos el registro existente con sus relaciones
            const existingEntity = await this.inventoryItemRepository.findOne({
                where: { inventoryItemId: entity.inventoryItemId },
                relations: ['inventory']
            });

            if (!existingEntity) {
                throw new InventoryItemNotFoundException('Item de inventario no encontrado');
            }

            // Actualizamos solo los campos que necesitamos
            existingEntity.location = entity.location;
            existingEntity.quantityOnHand = entity.quantityOnHand.value;

            // Mantenemos el inventoryId original
            const updateResult = await this.connection.getManager().save(InventoryItemOrmEntity, existingEntity);
            
            return InventoryItemMapper.toDomain(updateResult);
        } catch (error) {
            throw error;
        }
    }

    async stockDuplicated(itemId: bigint, inventoryId: bigint, location: LocationEnum):Promise<boolean>{
        const item = await this.inventoryItemRepository.exists({
                where: {
                    location: location,
                    inventoryItemId: Not(itemId),
                    inventoryId: inventoryId
                }
            });
        return item;
    }

    async existById(entityId: bigint): Promise<boolean> {
        return await this.inventoryItemRepository.existsBy({inventoryItemId: entityId});
    }

    async findByLocation(inventoryId: bigint, location: LocationEnum): Promise<InventoryItemEntity | null> {
        const result = await this.inventoryItemRepository.findOne({
            where: {
                location,
                inventoryId
            }
        });

        if (!result) {
            return Promise.resolve(null);
        }

        const ormEntity = InventoryItemMapper.toDomain(result);
        return ormEntity;
    }

    async findById(entityId: bigint): Promise<InventoryItemEntity | null> {
        const result = await this.inventoryItemRepository.findOne({
            where: { inventoryItemId: entityId },
        });
        return result ? InventoryItemMapper.toDomain(result) : null;
    }

    async findByLocationAndBranchOffice(branchOfficeId: bigint, location?: LocationEnum): Promise<InventoryItemEntity[]> {
        const result = await this.inventoryItemRepository.find({
            where: {
                inventory: {
                    branchOfficeId: branchOfficeId,
                },
                location: location
            },
            relations: [
                'inventory', 'inventory.product', 'inventory.product.category',
                'inventory.product.brand', 'inventory.product.season'
            ]
        });

        if (result.length === 0) return [];

        const items = result.map(item => InventoryItemMapper.toDomain(item));

        return items;
    }

    async findAll(): Promise<[] | InventoryItemEntity[]> {
        const result = await this.inventoryItemRepository.find({
            relations: [
                'inventory', 'inventory.product', 'inventory.lot', 'inventory.product.category',
                'inventory.product.brand', 'inventory.product.season'
            ],
            order: {
                inventory: {
                    productId: 'DESC',
                }
            }
        });

        if (result.length === 0) return [];

        const items = result.map(item => InventoryItemMapper.toDomain(item));

        return items;

    }
    async delete(entityId: bigint): Promise<InventoryItemEntity | null> {
        try {
            const entityExist = await this.inventoryItemRepository.findOne({
                where: {
                    inventoryItemId: entityId
                }
            });

            if (!entityExist) {
                throw new InventoryItemNotFoundException('Item de inventario no encontrado');
            }

            const result = this.inventoryItemRepository.query(
                `UPDATE inventory_item SET deleted_at = now() WHERE(inventory_item_id=${entityId});`
            );

            if (!result) {
                return Promise.resolve(null);
            }

            return InventoryItemMapper.toDomain(entityExist);
        } catch (error) {
            throw error;
        }


    }

}