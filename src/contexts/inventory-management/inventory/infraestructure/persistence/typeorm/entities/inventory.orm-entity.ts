import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { InventoryItemOrmEntity } from "src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity";
import { TransferOrmEntity } from "src/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity";
import { ProductOrmEntity } from "src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity";
import { ReturnsOrmEntity } from "src/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity";
import { SaleDetailOrmEntity } from "src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('inventory')
export class InventoryOrmEntity{
    @PrimaryGeneratedColumn('increment',{type: 'bigint', name: 'inventory_id' })
    inventoryId      : bigint;
    @Column({name: 'product_id', type: 'bigint', nullable: false})
    productId            : bigint;
    @Column({name: 'branch_office_id', type: 'bigint', nullable: false})
    branchOfficeId       : bigint;
    @Column({type: 'varchar', length: 100, nullable: true})
    internalBarCode?     : string | null;
    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'sale_price_one'})
    salePriceOne?        : number | null;
    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'sale_price_many'})
    salePriceMany?       : number | null;
    @Column({type: 'decimal', precision: 18, scale: 4, nullable: true, name: 'sale_quantity_many'})
    saleQuantityMany? : number | null;
    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'sale_price_special'})
    salePriceSpecial? : number | null;
    @Column({type: 'decimal', precision: 18, scale: 3, nullable: true, name: 'min_stock_branch'})
    minStockBranch?      : number | null;
    @Column({type: 'decimal', precision: 18, scale: 3, nullable: true, name: 'max_stock_branch'})
    maxStockBranch?      : number | null;
    @Column({type: 'boolean', name: 'is_sellable', nullable: false})
    isSellable           : boolean;
    
    @OneToOne(()=> ProductOrmEntity, (item)=> item.inventory)
    @JoinColumn({name: 'product_id'})
    product?             : ProductOrmEntity | null;
    @ManyToOne(()=> BranchOfficeOrmEntity, (item)=> item.inventoryItems)
    @JoinColumn({name: 'branch_office_id'})
    branchOffice?        : BranchOfficeOrmEntity | null;
    @OneToMany(()=> InventoryItemOrmEntity, (item)=> item.inventory, {cascade: true})
    inventoryItems?: InventoryItemOrmEntity[] | [];
    @OneToMany(() => SaleDetailOrmEntity, detail => detail.inventory)
    saleDetails?: SaleDetailOrmEntity[];
    @OneToMany(() => TransferOrmEntity, transfer => transfer.inventory)
    transfers?: TransferOrmEntity[];
    @OneToMany(()=> ReturnsOrmEntity, item=> item.inventory)
    returns: ReturnsOrmEntity[] | null;
    
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt?: Date | null;

}