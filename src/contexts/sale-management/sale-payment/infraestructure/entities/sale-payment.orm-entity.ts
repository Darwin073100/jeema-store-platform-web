import { PaymentMethodOrmEntity } from "src/contexts/sale-management/payment-method/infraestructure/persistence/typeorm/entities/payment-method.orm-entity";
import { SaleOrmEntity } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sale_payment')
export class SalePaymentOrmEntity {
    @PrimaryGeneratedColumn('increment',{ type: 'bigint', name: 'sale_payment_id' })
    salePaymentId: bigint;
    @Column({type: 'bigint', name: 'sale_id', nullable: false})
    saleId: bigint;
    @Column({type: 'bigint', name: 'payment_method_id', nullable: false})
    paymentMethodId: bigint;
    @Column({ type: 'decimal', precision: 18, scale: 2, name: 'amount_paid' })
    amountPaid: number;
    @Column({ type: 'varchar', length: 100, name: 'reference_number', nullable: true })
    referenceNumber?: string | null;
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt?: Date | null;
    @ManyToOne(()=> SaleOrmEntity, sale => sale.salePayments)
    @JoinColumn({name: 'sale_id'})
    sale?: SaleOrmEntity | null;
    @ManyToOne(()=> PaymentMethodOrmEntity, paymentMethod => paymentMethod.salePayments)
    @JoinColumn({name: 'payment_method_id'})
    paymentMethod?: PaymentMethodOrmEntity | null;
}