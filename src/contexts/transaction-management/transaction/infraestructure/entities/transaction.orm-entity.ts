import { CashSessionOrmEntity } from "src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { SaleOrmEntity } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity";
import { TransactionTypeOrmEntity } from "src/contexts/transaction-management/transaction-type/infraestructure/entities/transaction-type.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'transaction' })
export class TransactionOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'trsansaction_id' })
    transactionId: bigint;
    @Column({ type: 'bigint', name: 'transaction_type_id', nullable: false })
    transactionTypeId: bigint;
    @Column({ type: 'bigint', name: 'branch_office_id', nullable: false })
    branchOfficeId: bigint;
    @Column({ type: 'bigint', name: 'purchase_id', nullable: true })
    purchaseId: bigint | null;
    @Column({ type: 'bigint', name: 'sale_id', nullable: true })
    saleId: bigint | null;
    @Column({ type: 'bigint', name: 'cash_session_id', nullable: true })
    cashSessionId: bigint | null;
    @Column({ type: 'bigint', name: 'employee_id', nullable: false })
    employeeId: bigint;
    @Column({ type: 'decimal', precision: 14, scale: 2, name: 'amount', nullable: false })
    amount: number;
    @Column({ type: 'text', name: 'description', nullable: true })
    description: string | null;
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
    @ManyToOne(()=> TransactionTypeOrmEntity, (item)=> item.transactions)
    @JoinColumn({name: 'transaction_type_id'})
    transactionType: TransactionTypeOrmEntity | null;
    @ManyToOne(()=> BranchOfficeOrmEntity, (item)=> item.transactions)
    @JoinColumn({ name: 'branch_office_id'})
    branchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(()=> SaleOrmEntity, (item)=> item.transactions)
    @JoinColumn({ name: 'sale_id' })
    sale: SaleOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, (item)=> item.transactions)
    @JoinColumn({name: 'employee_id'})
    employee: EmployeeOrmEntity | null;
    @ManyToOne(()=> CashSessionOrmEntity, (item)=> item.transactions)
    @JoinColumn({name: 'cash_session_id'})
    cashSession: CashSessionOrmEntity | null;
}