import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { BranchOfficeOrmEntity } from 'src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import { EmployeeRoleOrmEntity } from 'src/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity';
import { GenderEnum } from 'src/contexts/employee-management/employee/domain/enums/gender.enum';
import { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { TransactionOrmEntity } from 'src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import { UserOrmEntity } from 'src/contexts/authentication-management/auth/infraestructure/entities/user.orm-entity';
import { TransferOrmEntity } from 'src/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import { CashSessionOrmEntity } from 'src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity';
import { ReturnsOrmEntity } from 'src/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import { AddressOrmEntity } from '@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';

@Entity('employee')
export class EmployeeOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'employee_id' })
  employeeId: bigint;
  @Column({ type: 'bigint', name: 'branch_office_id', nullable: false })
  branchOfficeId: bigint;
  @Column({ type: 'bigint', name: 'employee_role_id', nullable: false })
  employeeRoleId: bigint;
  @Column({ type: 'bigint', name: 'address_id', nullable: true })
  addressId: bigint | null;
  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: false })
  firstName: string;
  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: false })
  lastName: string;
  @Column({ type: 'varchar', length: 100, name: 'email', nullable: true})
  email: string | null;
  @Column({ type: 'varchar', length: 25, name: 'phone_number', nullable: true })
  phoneNumber: string | null;
  @Column({ type: 'timestamptz', name: 'birth_date', nullable: true })
  birthDate: Date | null;
  @Column({ type: 'enum', enum: GenderEnum, name: 'gender', nullable: true })
  gender: GenderEnum | null;
  @Column({ type: 'timestamptz', name: 'hire_date', nullable: true })
  hireDate: Date|null;
  @Column({ type: 'timestamptz', name: 'termination_date', nullable: true })
  terminationDate: Date | null;
  @Column({ type: 'time', name: 'entry_time', nullable: true })
  entryTime: string | null;
  @Column({ type: 'time', name: 'exit_time', nullable: true })
  exitTime: string | null;
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'current_salary', default: 0, nullable: true })
  currentSalary: number|null;
  @Column({ type: 'boolean', name: 'is_active', default: true, nullable: false })
  isActive: boolean;
  @Column({ type: 'varchar', length: 255, name: 'photo_url', nullable: true })
  photoUrl: string | null;
  
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  
  @ManyToOne(() => BranchOfficeOrmEntity, { nullable: false })
  @JoinColumn({ name: 'branch_office_id' })
  branchOffice: BranchOfficeOrmEntity | null;
  @ManyToOne(() => EmployeeRoleOrmEntity, { nullable: false })
  @JoinColumn({ name: 'employee_role_id' })
  employeeRole: EmployeeRoleOrmEntity | null;
  @OneToMany(()=> SaleOrmEntity, item=> item.employee)
  sales: SaleOrmEntity[] | null;
  @OneToOne(() => AddressOrmEntity, { nullable: true, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: AddressOrmEntity | null;
  @OneToOne(()=> UserOrmEntity, (user)=> user.employee, {onDelete: 'CASCADE'})
  user: UserOrmEntity | null;
  @OneToMany(()=> TransactionOrmEntity, (item)=> item.employee)
  transactions: TransactionOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.requestedByEmployee)
  requestedTransfers: TransferOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.receivedByEmployee)
  receivedTransfers: TransferOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.approvedByEmployee)
  approvedTransfers: TransferOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.shippedByEmployee)
  shippedTransfers: TransferOrmEntity[] | null;
  @OneToMany(() => CashSessionOrmEntity, (cashSession) => cashSession.employee) 
  cashSessions: CashSessionOrmEntity[] | null;
  @OneToMany(()=> ReturnsOrmEntity, item=> item.employee)
  returns: ReturnsOrmEntity[] | null;
}