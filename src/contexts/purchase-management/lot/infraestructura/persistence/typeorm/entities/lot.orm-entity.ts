import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { LotUnitPurchaseOrmEntity } from './lot-unit-purchase.orm-entity';
import { ForSaleEnum } from 'src/shared/domain/enums/for-sale.enum';
import { SuplierOrmEntity } from 'src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import { TemplateOrmEntity } from '@/shared/infrastructure/typeorm/template.orm-entity';

@Entity('lot')
@Index(['productId', 'lotNumber'], { unique: true })
export class LotOrmEntity extends TemplateOrmEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'lot_id' })
  lotId: bigint;
  @Column({ type: 'bigint', name: 'product_id' })
  productId: bigint;
  @Column({ type: 'bigint', name: 'suplier_id', nullable: true })
  suplierId: bigint | null;
  @ManyToOne(() => ProductOrmEntity, (product) => product.lots, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity | null;
  @Column({ type: 'varchar', length: 50, name: 'lot_number' })
  lotNumber: string;
  @Column({ type: 'decimal', precision: 12, scale: 4, name: 'purchase_price' })
  purchasePrice: string;
  @Column({ type: 'enum', enum: ForSaleEnum, name: 'purchase_unit', nullable: false })
  purchaseUnit: ForSaleEnum;
  @Column({ type: 'decimal', precision: 18, scale: 3, name: 'initial_quantity' })
  initialQuantity: string;
  @Column({ type: 'date', name: 'expiration_date', nullable: true })
  expirationDate: Date | null;
  @Column({ type: 'date', name: 'manufacturing_date', nullable: true })
  manufacturingDate: Date | null;
  @Column({ type: 'date', name: 'received_date', default: () => 'CURRENT_DATE' })
  receivedDate: Date;

  @OneToMany(()=> LotUnitPurchaseOrmEntity, (lotUnitPurchase)=> lotUnitPurchase.lot, {cascade: true})
  lotUnitPurchases: LotUnitPurchaseOrmEntity[]|null;
  @ManyToOne(()=> SuplierOrmEntity, (item)=> item.lots)
  @JoinColumn({name: 'suplier_id'})
  suplier: SuplierOrmEntity | null;
}
