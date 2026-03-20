import type { AddressOrmEntity } from 'src/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { CashRegisterOrmEntity } from 'src/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity';
import { EmployeeOrmEntity } from 'src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity';
import { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { InventoryOrmEntity } from 'src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { TransferOrmEntity } from 'src/contexts/inventory-management/transfer/infraestructure/entities/transfer.orm-entity';
import { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import { TransactionOrmEntity } from 'src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('branch_office')
export class BranchOfficeOrmEntity {
  @PrimaryGeneratedColumn('increment',{ name: 'branch_office_id', type: 'bigint' })
  branchOfficeId: bigint;
  @Column({ type: 'bigint', name: 'address_id', nullable: false, unique: true })
  addressId: bigint;
  @Column({ type: 'bigint', name: 'establishment_id' })
  establishmentId: bigint;
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @JoinColumn({ name: 'address_id' })
  @OneToOne('AddressOrmEntity', 'branchOffice', { cascade: true, eager: true, onDelete: 'CASCADE' })
  address: AddressOrmEntity;
  @ManyToOne(() => EstablishmentOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentOrmEntity | null;
  
  @OneToMany(() => EmployeeOrmEntity, employee => employee.branchOffice)
  employees: EmployeeOrmEntity[] | null;
  @OneToMany(()=> InventoryOrmEntity, (item)=> item.branchOffice)
  inventoryItems: InventoryOrmEntity[] | null;
  @OneToMany(()=> SaleOrmEntity, item=> item.branchOffice)
  sales: SaleOrmEntity[] | null;  
  @OneToMany(()=> TransactionOrmEntity, (item)=> item.branchOffice)
  transactions: TransactionOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.fromBranchOffice)
  fromTransfers: TransferOrmEntity[] | null;
  @OneToMany(()=> TransferOrmEntity, (item)=> item.toBranchOffice)
  toTransfers: TransferOrmEntity[] | null;
  @OneToMany(()=> CashRegisterOrmEntity, (item)=> item.branchOffice)
  cashRegisters: CashRegisterOrmEntity[] | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
