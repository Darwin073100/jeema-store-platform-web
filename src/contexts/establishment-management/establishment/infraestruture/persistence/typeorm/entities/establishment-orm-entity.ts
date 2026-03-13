// src/contexts/educational-center-management/educational-center/infrastructure/persistence/typeorm/entities/educational-center.orm-entity.ts

import { BranchOfficeOrmEntity } from 'src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import { BrandOrmEntity } from 'src/contexts/product-management/brand/infraestruture/persistence/typeorm/entities/brand-orm-entity';
import { CategoryOrmEntity } from 'src/contexts/product-management/category/infraestructure/persistence/typeorm/entities/category.orm-entity';
import { ProductOrmEntity } from 'src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity';
import { SeasonOrmEntity } from 'src/contexts/product-management/season/infraestructure/persistence/typeorm/entities/season.orm-entity';
import { SuplierOrmEntity } from 'src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import { CustomerOrmEntity } from 'src/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';

/**
 * EducationalCenterOrmEntity es una entidad de TypeORM que representa la tabla
 * 'educational_centers' en la base de datos.
 *
 * Esta clase NO es parte de la capa de Dominio. Es una representación de infraestructura
 * para la persistencia. Contiene decoradores específicos de TypeORM.
 */
@Entity('establishment') // Mapea esta clase a la tabla 'educational_centers'
export class EstablishmentOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'establishment_id' })
  establishmentId: bigint; // Usamos bigint para corresponder con bigserial de PostgreSQL

  @Column({ type: 'varchar', length: 250, unique: true, nullable: false })
  name: string;

  @OneToMany(()=> BranchOfficeOrmEntity, branchOffice=> branchOffice.establishment)
  branchOffices: BranchOfficeOrmEntity[]|null;

  @OneToMany(() => ProductOrmEntity, (product) => product.establishment)
  products: ProductOrmEntity[] | null;

  @OneToMany(()=> CustomerOrmEntity, (customer)=> customer.establishment)
  customers: CustomerOrmEntity[] | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  @OneToMany(()=> SeasonOrmEntity, (item) => item.establishment)
  seasons: SeasonOrmEntity[] | null;
  @OneToMany(()=> BrandOrmEntity, (item)=> item.establishment)
  brands: BrandOrmEntity[] | null;
  @OneToMany(()=> CategoryOrmEntity, (item)=> item.establishment)
  categories: CategoryOrmEntity[] | null;
  @OneToMany(()=> SuplierOrmEntity, (item)=> item.establishment)
  supliers: SuplierOrmEntity[] | null;
}