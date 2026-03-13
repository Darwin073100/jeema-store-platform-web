import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn, OneToOne } from 'typeorm';
import { ForSaleEnum } from '../../../../../../../shared/domain/enums/for-sale.enum';
import { EstablishmentOrmEntity } from '@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { CategoryOrmEntity } from '@/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity';
import { BrandOrmEntity } from '@/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity';
import { SaleDetailOrmEntity } from '@/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity';
import { InventoryOrmEntity } from '@/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { LotOrmEntity } from '@/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import { SeasonOrmEntity } from '@/contexts/product-management/season/infraestructure/persistence/typeorm/entities/season.orm-entity';

@Entity('product')
@Index(['establishmentId', 'name'])
@Index(['establishmentId', 'sku'], { unique: true })
@Index(['establishmentId', 'universalBarCode'], { unique: true })
export class ProductOrmEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'product_id' })
    productId: bigint;
    @Column({ type: 'bigint', name: 'establishment_id' })
    establishmentId: bigint;
    @Column({ type: 'bigint', name: 'category_id' })
    categoryId: bigint;
    @Column({ type: 'bigint', name: 'brand_id', nullable: true })
    brandId: bigint | null;
    @Column({ type: 'bigint', name: 'season_id', nullable: true })
    seasonId: bigint | null;
    @Column({ type: 'varchar', length: 150 })
    name: string;
    @Column({ type: 'varchar', length: 50, nullable: true })
    sku: string | null;
    @Column({ type: 'varchar', length: 100, name: 'universal_bar_code', nullable: true })
    universalBarCode: string | null;
    @Column({ type: 'text', nullable: true })
    description: string | null;
    @Column({ type: 'enum', enum: ForSaleEnum, name: 'unit_of_measure' })
    unitOfMeasure: ForSaleEnum;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'min_stock_global', default: 0 })
    minStockGlobal: string;
    @Column({ type: 'varchar', length: 255, name: 'image_url', nullable: true })
    imageUrl: string | null;

    @ManyToOne(() => EstablishmentOrmEntity, (establishment) => establishment.products)
    @JoinColumn({ name: 'establishment_id' })
    establishment?: EstablishmentOrmEntity|null;
    @ManyToOne(() => CategoryOrmEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category?: CategoryOrmEntity|null;
    @ManyToOne(() => BrandOrmEntity, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand?: BrandOrmEntity | null;
    @ManyToOne(() => SeasonOrmEntity, (season) => season.products)
    @JoinColumn({ name: 'season_id' })
    season?: SeasonOrmEntity | null;
    @OneToMany(() => LotOrmEntity, (lot) => lot.product, { nullable: true , cascade: true})
    lots?: LotOrmEntity[] | null;
    @OneToOne(()=> InventoryOrmEntity, (item)=> item.product, {cascade: true})
    inventory?: InventoryOrmEntity | null;
    @OneToMany(() => SaleDetailOrmEntity, detail => detail.product)
    saleDetails?: SaleDetailOrmEntity[];

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}
