import { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('brand') // Mapea esta clase a la tabla 'brand'
export class BrandOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'brand_id' })
  brandId: bigint; // Usamos bigint para corresponder con bigserial de PostgreSQL
  @Column({type: 'bigint', nullable: false, name: 'establishment_id'})
  establishmentId: bigint;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products: ProductOrmEntity[]|null;
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  @ManyToOne(()=> EstablishmentOrmEntity)
  @JoinColumn({name: 'establishment_id'})
  establishment: EstablishmentOrmEntity | null;
}