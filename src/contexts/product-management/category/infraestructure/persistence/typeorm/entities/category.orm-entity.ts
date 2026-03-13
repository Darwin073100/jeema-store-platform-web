import { EstablishmentOrmEntity } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity";
import { ProductOrmEntity } from "src/contexts/product-management/product/infraestructure/persistence/typeorm/entities/product.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'category'})
export class CategoryOrmEntity{
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'category_id' })
    categoryId: bigint; // Usamos bigint para corresponder con bigserial de PostgreSQL
    @Column({type: 'bigint', nullable: false, name: 'establishment_id'})
    establishmentId: bigint;
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;
    @Column({name: 'description', type: 'text', nullable: true})
    description: string | null;
    @OneToMany(() => ProductOrmEntity, (product) => product.category)
    products: ProductOrmEntity[] | null;
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