import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { InventoryOrmEntity } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('inventory_item')
export class InventoryItemOrmEntity{
    @PrimaryGeneratedColumn('increment',{type: 'bigint', name: 'inventory_item_id' })
    inventoryItemId      : bigint;
    @Column({type: 'bigint', name: 'inventory_id', nullable: false})
    inventoryId: bigint;
    @Column({ type: 'enum', enum: LocationEnum, name: 'location', nullable: true })
    location             : LocationEnum;
    @Column({type: 'decimal', precision: 18, scale: 3, nullable: false, name: 'quantity_on_hand', default: 0})
    quantityOnHand        : number;
    
    @ManyToOne(()=> InventoryOrmEntity, (inventory)=> inventory.inventoryItems)
    @JoinColumn({ name: 'inventory_id' })
    inventory?: InventoryOrmEntity|null;
    
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt?: Date | null;
}