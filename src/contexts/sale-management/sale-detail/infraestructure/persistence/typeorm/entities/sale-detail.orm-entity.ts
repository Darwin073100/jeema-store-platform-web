import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { InventoryOrmEntity } from 'src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { SaleForEnum } from 'src/contexts/sale-management/sale-detail/domain/enums/sale-for.enum';
import { ReturnsOrmEntity } from 'src/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import { ForSaleEnum } from 'src/shared/domain/enums/for-sale.enum';

@Entity('sale_detail')
export class SaleDetailOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'sale_detail_id' })
  saleDetailId: bigint;
  @Column({ type: 'bigint', name: 'sale_id' })
  saleId: bigint;
  @Column({ type: 'bigint', name: 'product_id' })
  productId: bigint;
  @Column({ type: 'bigint', name: 'inventory_id' })
  inventoryId: bigint;
  @Column({ type: 'varchar', length: 100, name: 'product_name_at_sale' })
  productNameAtSale: string;
  @Column({ type: 'text', name: 'product_description_at_sale', nullable: true })
  productDescriptionAtSale: string | null;
  @Column({ type: 'varchar', length: 100, name: 'product_bar_code_at_sale' })
  productBarCodeAtSale: string;
  @Column({ type: 'varchar', length: 100, name: 'product_brand_at_sale', nullable: true })
  productBrandAtSale: string | null;
  @Column({ type: 'varchar', length: 100, name: 'product_category_at_sale', nullable: true })
  productCategoryAtSale: string | null;
  @Column({ type: 'varchar', length: 20, name: 'product_unit_at_sale' })
  productUnitAtSale: ForSaleEnum;
  @Column({ type: 'decimal', precision: 18, scale: 3, name: 'quantity' })
  quantity: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'unit_price_at_sale' })
  unitPriceAtSale: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'regular_price_at_sale' })
  regularPriceAtSale: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'discount_item', default: 0 })
  discountItem: number;
  @Column({type: 'enum', enum: SaleForEnum})
  saleFor: SaleForEnum
  @Column({ type: 'decimal', precision: 14, scale: 2, name: 'subtotal_item' })
  subtotalItem: number;
  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: string | null;
  
  @ManyToOne(() => SaleOrmEntity, sale => sale.saleDetails)
  @JoinColumn({ name: 'sale_id' })
  sale: SaleOrmEntity | null;
  @ManyToOne(() => ProductOrmEntity, product => product.saleDetails)
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity | null;
  @ManyToOne(() => InventoryOrmEntity)
  @JoinColumn({ name: 'inventory_id' })
  inventory: InventoryOrmEntity | null;
  @OneToMany(()=> ReturnsOrmEntity, item=> item.saleDetail)
  returns: ReturnsOrmEntity[] | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
