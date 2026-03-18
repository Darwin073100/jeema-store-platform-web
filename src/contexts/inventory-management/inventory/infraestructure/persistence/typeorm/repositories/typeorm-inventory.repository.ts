import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { DataSource, Repository } from "typeorm";
import { InventoryOrmEntity } from "../entities/inventory.orm-entity";
import { InventoryMapper } from "../mapper/inventory.mapper";
import { InventoryNotFoundException } from "src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormInventoryRepository implements InventoryRepository{
    private readonly inventoryRepository: Repository<InventoryOrmEntity>;

    constructor(private readonly datasource: DataSource){
        this.inventoryRepository = this.datasource.getRepository(InventoryOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<InventoryRepository> {
        const dataSource = await getDataSource();
        return new TypeormInventoryRepository(dataSource);
    }

    /**
     * Guarda o actualiza un inventario
     * @param {InventoryEntity} entity - Recibe la entidad a guardar o a modificar
     * @returns {Promise<InventoryEntity>} - Retorna la entidad persistida
     */
    async save(entity: InventoryEntity): Promise<InventoryEntity> {
        // Buscar por la clave única: productId + branchOfficeId, NO por inventoryId
        let inventoryExist = await this.inventoryRepository.findOne({
            where: { 
                productId: entity.productId,
                branchOfficeId: entity.branchOfficeId
            }
        });
        
        if (inventoryExist) {
            inventoryExist.internalBarCode = entity.internalBarCode?.value;
            inventoryExist.salePriceOne = entity.salePriceOne?.value;
            inventoryExist.salePriceMany = entity.salePriceMany?.value ?? null;
            inventoryExist.saleQuantityMany = entity.saleQuantityMany?.value ?? null;
            inventoryExist.salePriceSpecial = entity.salePriceSpecial?.value ?? null;
            inventoryExist.isSellable = entity.isSellable;
            inventoryExist.maxStockBranch = entity.maxStockBranch?.value;
            inventoryExist.minStockBranch = entity.minStockBranch?.value;
            inventoryExist.productId = entity.productId;
            
            console.log(inventoryExist);
            const updatedInventory = await this.inventoryRepository.save(inventoryExist);

            return InventoryMapper.toDomain(updatedInventory);
        }

        const ormEntity = InventoryMapper.toOrmEntity(entity);
        const result = await this.inventoryRepository.save(ormEntity);
        return InventoryMapper.toDomain(result);
    }
    
    async findById(entityId: bigint): Promise<InventoryEntity | null> {
        const result = await this.inventoryRepository.findOne({ 
            where: { inventoryId: entityId },
            relations:['product','product.category','lot'] 
        });
        return result ? InventoryMapper.toDomain(result) : null;
    }
    async findBarcodeById(entityId: bigint): Promise<InventoryEntity | null> {
        const result = await this.inventoryRepository.findOne({ 
            where: { inventoryId: entityId },
            relations:['product',] 
        });
        return result ? InventoryMapper.toDomain(result) : null;
    }

    async findByInternalBarCode(internalBarCode: string): Promise<InventoryEntity | null> {
    const result = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .where('LOWER(inventory.internalBarCode) = LOWER(:internalBarCode)', { internalBarCode })
        .orWhere('LOWER(product.universalBarCode) = LOWER(:internalBarCode)', { internalBarCode })
        .leftJoinAndSelect('inventory.product', 'product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('inventory.inventoryItems', 'inventoryItems')
        .getOne();

    return result ? InventoryMapper.toDomain(result) : null;
}
    async findByInternalBarCodeInBranchOffice(internalBarCode: string, branchOfficeId: bigint): Promise<InventoryEntity | null> {
    const result = await this.inventoryRepository.findOne({ 
            where: { 
                internalBarCode,
                branchOfficeId
            },
        });
    return result ? InventoryMapper.toDomain(result) : null;
}
    // async findByInternalBarCode(internalBarCode: string): Promise<InventoryEntity | null> {
    //     const result = await this.inventoryRepository.findOne({ 
    //         where: { internalBarCode: internalBarCode },
    //         relations:{
    //             product: true,
    //             inventoryItems: true
    //         }
    //     });
    //     return result ? InventoryMapper.toDomain(result) : null;
    // }

    async findAll(): Promise<[] | InventoryEntity[]> {
        const result = await this.inventoryRepository.find({
            relations: ['product','product.category']
        });
        
        if(result.length === 0) return [];

        const items = result.map(item=> InventoryMapper.toDomain(item));

        return items;

    }
    /**
     * Elimina un inventario utilizando estrategia, Soft Delete
     * @param {bigint} entityId - El ID del inventario a eliminar
     * @returns {Promise<InventoryEntity | null>} - La entidad de inventario eliminada o null si no se encuentra
     */
    async delete(entityId: bigint): Promise<InventoryEntity | null> {
        const inventoryExist = await this.inventoryRepository.findOne({
            where: { inventoryId: entityId }
        });

        if (!inventoryExist) {
            throw new InventoryNotFoundException('El inventario especificado no encontrado.');
        }

        await this.inventoryRepository.query(`UPDATE inventory SET deleted_at = NOW() WHERE inventory_id = ${entityId};`);
        return InventoryMapper.toDomain(inventoryExist);
    }

    async existById(inventoryId: bigint): Promise<boolean> {
        const result = await this.inventoryRepository.existsBy({
            inventoryId
        });
        return Promise.resolve(result);
    }
    
}