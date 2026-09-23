import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferOrmEntity } from "./cloud-transfer.orm-entity";
import { ProductOrmEntity } from "src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity";
import { CategoryOrmEntity } from "src/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity";
import { InventoryOrmEntity } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { LotOrmEntity } from "src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity";
import { InventoryItemOrmEntity } from "src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity";

@Entity({ name: 'cloud_transfer_item' })
@Index(['cloudTransferId'])
@Index(['cloudTransferId', 'resolutionStatus'])
@Index(['productUniversalBarCode'])
export class CloudTransferItemOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'cloud_transfer_item_id' })
    cloudTransferItemId: bigint;
    @Column({ type: 'bigint', name: 'cloud_transfer_id' })
    cloudTransferId: bigint;
    @Column({ type: 'int', name: 'line_number' })
    lineNumber: number;

    @Column({ type: 'bigint', name: 'origin_local_product_id', nullable: true })
    originLocalProductId: bigint | null;
    @Column({ type: 'bigint', name: 'origin_local_lot_id', nullable: true })
    originLocalLotId: bigint | null;
    @Column({ type: 'bigint', name: 'origin_local_inventory_item_id', nullable: true })
    originLocalInventoryItemId: bigint | null;

    @Column({ type: 'varchar', length: 100, name: 'product_universal_bar_code', nullable: true })
    productUniversalBarCode: string | null;
    @Column({ type: 'varchar', length: 150, name: 'product_name' })
    productName: string;
    @Column({ type: 'varchar', length: 50, name: 'product_sku', nullable: true })
    productSku: string | null;
    @Column({ type: 'varchar', length: 100, name: 'product_category_name' })
    productCategoryName: string;
    @Column({ type: 'text', name: 'product_category_description', nullable: true })
    productCategoryDescription: string | null;
    @Column({ type: 'varchar', length: 100, name: 'product_brand_name', nullable: true })
    productBrandName: string | null;
    @Column({ type: 'text', name: 'product_description', nullable: true })
    productDescription: string | null;
    @Column({ type: 'enum', enum: ForSaleEnum, name: 'product_unit_of_measure' })
    productUnitOfMeasure: ForSaleEnum;
    @Column({ type: 'varchar', length: 255, name: 'product_image_url', nullable: true })
    productImageUrl: string | null;

    @Column({ type: 'varchar', length: 50, name: 'lot_number' })
    lotNumber: string;
    @Column({ type: 'decimal', precision: 12, scale: 4, name: 'lot_purchase_price' })
    lotPurchasePrice: string;
    @Column({ type: 'enum', enum: ForSaleEnum, name: 'lot_purchase_unit' })
    lotPurchaseUnit: ForSaleEnum;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'lot_transferred_quantity' })
    lotTransferredQuantity: string;
    @Column({ type: 'date', name: 'lot_expiration_date', nullable: true })
    lotExpirationDate: Date | null;
    @Column({ type: 'date', name: 'lot_manufacturing_date', nullable: true })
    lotManufacturingDate: Date | null;
    @Column({ type: 'date', name: 'lot_origin_received_date', nullable: true })
    lotOriginReceivedDate: Date | null;
    @Column({ type: 'varchar', length: 150, name: 'lot_supplier_name', nullable: true })
    lotSupplierName: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_one', nullable: true })
    inventorySuggestedSalePriceOne: string | null;
    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_many', nullable: true })
    inventorySuggestedSalePriceMany: string | null;
    @Column({ type: 'decimal', precision: 18, scale: 4, name: 'inventory_suggested_sale_quantity_many', nullable: true })
    inventorySuggestedSaleQuantityMany: string | null;
    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_special', nullable: true })
    inventorySuggestedSalePriceSpecial: string | null;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'inventory_origin_quantity_on_hand', nullable: true })
    inventoryOriginQuantityOnHand: string | null;
    @Column({ type: 'enum', enum: LocationEnum, name: 'inventory_suggested_location', nullable: true })
    inventorySuggestedLocation: LocationEnum | null;

    @Column({ type: 'enum', enum: CloudTransferItemResolutionStatusEnum, name: 'resolution_status', default: CloudTransferItemResolutionStatusEnum.PENDING })
    resolutionStatus: CloudTransferItemResolutionStatusEnum;
    @Column({ type: 'bigint', name: 'matched_local_product_id', nullable: true })
    matchedLocalProductId: bigint | null;
    @Column({ type: 'bigint', name: 'matched_local_category_id', nullable: true })
    matchedLocalCategoryId: bigint | null;
    @Column({ type: 'bigint', name: 'matched_local_inventory_id', nullable: true })
    matchedLocalInventoryId: bigint | null;
    @Column({ type: 'bigint', name: 'matched_local_lot_id', nullable: true })
    matchedLocalLotId: bigint | null;
    @Column({ type: 'bigint', name: 'matched_local_inventory_item_id', nullable: true })
    matchedLocalInventoryItemId: bigint | null;
    @Column({ type: 'boolean', name: 'auto_matched_by_barcode', default: false })
    autoMatchedByBarcode: boolean;
    @Column({ type: 'text', name: 'rejection_reason', nullable: true })
    rejectionReason: string | null;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;

    // Tipo `any` deliberado — ver la nota completa en `cloud-transfer.orm-entity.ts` (propiedad `items`):
    // mismo import circular, mismo fix (`Relation<T>` y `import(...)` inline type-only no bastan para
    // silenciar TS1272 bajo `isolatedModules` + `emitDecoratorMetadata` de este tsconfig).
    @ManyToOne(() => CloudTransferOrmEntity, (t) => t.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cloud_transfer_id' })
    cloudTransfer: any;
    @ManyToOne(() => ProductOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'matched_local_product_id' })
    matchedLocalProduct: ProductOrmEntity | null;
    @ManyToOne(() => CategoryOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'matched_local_category_id' })
    matchedLocalCategory: CategoryOrmEntity | null;
    @ManyToOne(() => InventoryOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'matched_local_inventory_id' })
    matchedLocalInventory: InventoryOrmEntity | null;
    @ManyToOne(() => LotOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'matched_local_lot_id' })
    matchedLocalLot: LotOrmEntity | null;
    @ManyToOne(() => InventoryItemOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'matched_local_inventory_item_id' })
    matchedLocalInventoryItem: InventoryItemOrmEntity | null;
}
