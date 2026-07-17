import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import type { BranchOfficeOrmEntity } from 'src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import type { EmployeeRoleOrmEntity } from 'src/contexts/employee-management/employee-role/infraestruture/persistence/typeorm/entities/employee-role-orm-entity';
import { GenderEnum } from 'src/contexts/employee-management/employee/domain/enums/gender.enum';
import type { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import type { TransactionOrmEntity } from 'src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import type { UserOrmEntity } from 'src/contexts/authentication-management/auth/infraestructure/entities/user.orm-entity';
import type { TransferOrmEntity } from 'src/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import type { CashSessionOrmEntity } from 'src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity';
import type { ReturnsOrmEntity } from 'src/contexts/sale-management/returns/infraestructure/entities/returns.orm-entity';
import type { AddressOrmEntity } from 'src/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';

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
  
  @ManyToOne('BranchOfficeOrmEntity',(branch: BranchOfficeOrmEntity)=> branch.employees, { nullable: false })
  @JoinColumn({ name: 'branch_office_id' })
  branchOffice: BranchOfficeOrmEntity | null;
  @ManyToOne('EmployeeRoleOrmEntity', (employeeRole: EmployeeRoleOrmEntity)=> employeeRole.employees ,{ nullable: false })
  @JoinColumn({ name: 'employee_role_id' })
  employeeRole: EmployeeRoleOrmEntity | null;
  @OneToMany('SaleOrmEntity', (item: SaleOrmEntity)=> item.employee)
  sales: SaleOrmEntity[] | null;
  @OneToOne('AddressOrmEntity', (address: AddressOrmEntity)=> address.employee,{ nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: AddressOrmEntity | null;
  @OneToOne('UserOrmEntity', (user: UserOrmEntity)=> user.employee, {onDelete: 'CASCADE'})
  user: UserOrmEntity | null;
  @OneToMany('TransactionOrmEntity', (item: TransactionOrmEntity)=> item.employee)
  transactions: TransactionOrmEntity[] | null;
  @OneToMany('TransferOrmEntity', (item: TransferOrmEntity)=> item.requestedByEmployee)
  requestedTransfers: TransferOrmEntity[] | null;
  @OneToMany('TransferOrmEntity', (item: TransferOrmEntity)=> item.receivedByEmployee)
  receivedTransfers: TransferOrmEntity[] | null;
  @OneToMany('TransferOrmEntity', (item: TransferOrmEntity)=> item.approvedByEmployee)
  approvedTransfers: TransferOrmEntity[] | null;
  @OneToMany('TransferOrmEntity', (item: TransferOrmEntity)=> item.shippedByEmployee)
  shippedTransfers: TransferOrmEntity[] | null;
  @OneToMany('CashSessionOrmEntity', (cashSession: CashSessionOrmEntity) => cashSession.employee) 
  cashSessions: CashSessionOrmEntity[] | null;
  @OneToMany('ReturnsOrmEntity', (item: ReturnsOrmEntity)=> item.employee)
  returns: ReturnsOrmEntity[] | null;
}