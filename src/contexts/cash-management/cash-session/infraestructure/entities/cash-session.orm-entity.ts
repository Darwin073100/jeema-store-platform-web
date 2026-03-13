import { TemplateOrmEntity } from "@/shared/infrastructure/typeorm/template.orm-entity";
import { CashRegisterOrmEntity } from "src/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { SaleOrmEntity } from "src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity";
import { TransactionOrmEntity } from "src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cash_session')
export class CashSessionOrmEntity extends TemplateOrmEntity {
    @PrimaryGeneratedColumn('increment', {type: 'bigint', name: 'cash_session_id'})
    cashSessionId: bigint;
    @Column({type: 'bigint', name: 'cash_register_id', nullable: false})
    cashRegisterId: bigint;
    @Column({type: 'bigint', name: 'employee_id', nullable: false})
    employeeId: bigint;
    @Column({type: "timestamptz", name: 'start_time', nullable: false})
    startTime: Date;
    @Column({type: "decimal", precision: 14, scale:2, name: 'start_balance', nullable: false})
    startBalance: number;
    @Column({type: "timestamptz", name: 'end_time', nullable: true})
    endTime: Date | null;
    @Column({type: "decimal", precision: 14, scale:2, name: 'expected_balance', nullable: true})
    expectedBalance: number | null;
    @Column({type: "decimal", precision: 14, scale:2, name: 'actual_balance', nullable: true})
    actualBalance: number | null;
    @Column({type: "decimal", precision: 14, scale:2, name: 'difference', nullable: true})
    diference: number | null;
    @Column({type: "boolean", name: 'is_closed', nullable: false, default: false})
    isClosed: boolean;
    @Column({type: "text", name: 'closing_notes', nullable: true})
    closingNotes: string | null;
    
    @ManyToOne(() => CashRegisterOrmEntity, (cashRegister) => cashRegister.cashSessions)
    @JoinColumn({name: 'cash_register_id'})
    cashRegister: CashRegisterOrmEntity | null;
    @ManyToOne(() => EmployeeOrmEntity, (employee) => employee.cashSessions)
    @JoinColumn({name: 'employee_id'})
    employee: EmployeeOrmEntity | null;
    @OneToMany(()=> TransactionOrmEntity, (item)=> item.cashSession)
    transactions: TransactionOrmEntity[] | null;
    @OneToMany(()=> SaleOrmEntity, (sale)=> sale.cashSession)
    sales: SaleOrmEntity[] | null;
}