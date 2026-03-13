import { SalePaymentOrmEntity } from "src/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'payment_method'})
export class PaymentMethodOrmEntity{
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'payment_method_id' })
    paymentMethodId: bigint; // Usamos bigint para corresponder con bigserial de PostgreSQL
    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    name: string;
    @Column({name: 'requires_reference', type: 'boolean', nullable: false})
    requiresReference: boolean;

    @OneToMany(() => SalePaymentOrmEntity, payment => payment.paymentMethod)
    salePayments?: SalePaymentOrmEntity[];

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}