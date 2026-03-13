import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { LotOrmEntity } from "./lot.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'lot_unit_purchase' })
export class LotUnitPurchaseOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'lot_unit_purchase_id' })
    lotUnitPurchaseId: bigint;
    @Column({ type: 'bigint', name: 'lot_id', nullable: false }) // Permitir null temporalmente durante cascade
    lotId: bigint;
    @Column({ type: 'decimal', precision: 18, scale: 2, name: 'purchase_price', nullable: false })
    purchasePrice: number;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'purchase_quantity', nullable: false })
    purchaseQuantity: number;
    @Column({ type: 'enum', enum: ForSaleEnum, name: 'unit', nullable: false })
    unit: ForSaleEnum;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'units_in_purchase_unit', nullable: false })
    unitsInPurchaseUnit: number; // Cantidad de UNIDADES BASE que hay en esta unidad de compra (ej. 1 paquete = 10 bolsas)
    
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true })
    updatedAt?: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt?: Date | null;
    
    @ManyToOne(()=> LotOrmEntity, (lot)=> lot.lotUnitPurchases)
    @JoinColumn({ name: 'lot_id' })
    lot?: LotOrmEntity | null;
}