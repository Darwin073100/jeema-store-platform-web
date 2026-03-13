/**
 * Entidad ORM: ProductOrmEntity
 * Mapea la tabla 'product' de la base de datos
 * Esta clase es solo para persistencia, NO contiene lógica de dominio
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RegisterEntity } from '@/configuration/databases/typeorm/config/entities';
import { ForSaleEnum } from '@/shared/domain/enums/for-sale.enum';

// Notas: Las entidades relacionadas se importarían cuando estén disponibles
// Por ahora, usamos type-safe relations con sus nombres

@RegisterEntity()
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

  // Relaciones (lazy loading - se cargan bajo demanda)
  // @ManyToOne(() => EstablishmentOrmEntity)
  // @JoinColumn({ name: 'establishment_id' })
  // establishment?: EstablishmentOrmEntity | null;

  // @ManyToOne(() => CategoryOrmEntity)
  // @JoinColumn({ name: 'category_id' })
  // category?: CategoryOrmEntity | null;

  // @ManyToOne(() => BrandOrmEntity)
  // @JoinColumn({ name: 'brand_id' })
  // brand?: BrandOrmEntity | null;

  // @ManyToOne(() => SeasonOrmEntity)
  // @JoinColumn({ name: 'season_id' })
  // season?: SeasonOrmEntity | null;

  // @OneToMany(() => LotOrmEntity, (lot) => lot.product, { cascade: true })
  // lots?: LotOrmEntity[] | null;

  // @OneToOne(() => InventoryOrmEntity, { cascade: true })
  // inventory?: InventoryOrmEntity | null;

  // @OneToMany(() => SaleDetailOrmEntity, (detail) => detail.product)
  // saleDetails?: SaleDetailOrmEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  constructor(data?: Partial<ProductOrmEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
