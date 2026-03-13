import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { CustomerOrmEntity } from "src/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SaleDetailOrmEntity } from "src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { SaleStatusEnum } from "src/contexts/sale-management/sale/domain/enums/sale-status.enum";
import { SalePaymentOrmEntity } from "src/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity";
import { TransactionOrmEntity } from "src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity";
import { CashSessionOrmEntity } from "src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity";

@Entity({name: 'sale'})
export class SaleOrmEntity{
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'sale_id' })
    saleId: bigint;
    @Column({name: 'branch_office_id', type: 'bigint', nullable: false})
    branchOfficeId: bigint;
    @Column({name: 'customer_id', type: 'bigint', nullable: false})
    customerId: bigint;
    @Column({name: 'employee_id', type: 'bigint', nullable: false})
    employeeId: bigint;
    @Column({type: 'bigint', name: 'cash_session_id', nullable: false})
    cashSessionId: bigint;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'sub_total_amount', default: 0})
    subTotalAmount: number;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'discount_amount', default: 0})
    discountAmount: number;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'tax_amount', default: 0})
    taxAmount: number;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'total_amount', default: 0})
    totalAmount: number;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'in_amount', default: 0})
    inAmount: number;
    @Column({type: 'decimal', precision: 14, scale: 2, nullable: false, name: 'out_amount', default: 0})
    outAmount: number;
    @Column({type: 'enum', enum: SaleStatusEnum, nullable: false, name: 'status' })
    status: SaleStatusEnum;
    @Column({type: 'text', name: 'notes', nullable: true})
    notes: string | null;
    
    @ManyToOne(()=> BranchOfficeOrmEntity, item=> item.sales)
    @JoinColumn({name: 'branch_office_id'})
    branchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(()=> CustomerOrmEntity, item=> item.sales)
    @JoinColumn({name: 'customer_id'})
    customer: CustomerOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, item=> item.sales)
    @JoinColumn({name: 'employee_id'})
    employee: EmployeeOrmEntity | null;
    @OneToMany(() => SaleDetailOrmEntity, detail => detail.sale)
    saleDetails: SaleDetailOrmEntity[] | null;
    @OneToMany(() => SalePaymentOrmEntity, payment => payment.sale)
    salePayments: SalePaymentOrmEntity[] | null;
    @OneToMany(()=> TransactionOrmEntity, (item)=> item.sale)
    transactions: TransactionOrmEntity[] | null;
    @ManyToOne(()=> CashSessionOrmEntity, (cashSession)=> cashSession.sales)
    @JoinColumn({name: 'cash_session_id'})
    cashSession: CashSessionOrmEntity | null;
    
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
    
}