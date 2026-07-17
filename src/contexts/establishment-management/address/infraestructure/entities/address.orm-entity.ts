import { TemplateOrmEntity } from 'src/shared/infrastructure/typeorm/template.orm-entity';
import type { EmployeeOrmEntity } from 'src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity';
import type { BranchOfficeOrmEntity } from 'src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity';
import type { SuplierOrmEntity } from 'src/contexts/purchase-management/suplier/infraestructure/persistence/typeorm/entities/suplier.orm-entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
  } from 'typeorm';
import type { CustomerOrmEntity } from '@/contexts/sale-management/customer/infraestructure/persistence/typeorm/entities/customer.orm-entity';

  @Entity('address')
  export class AddressOrmEntity extends TemplateOrmEntity {
    @PrimaryGeneratedColumn('increment', { name: 'address_id', type: 'bigint' })
    addressId: bigint;
    @Column({ type: 'varchar', length: 255, nullable: true })
    street: string | null;
    @Column({ type: 'varchar', length: 20, nullable: true, name: 'external_number' })
    externalNumber: string | null;
    @Column({ type: 'varchar', length: 20, nullable: true, name: 'internal_number' })
    internalNumber: string | null;
    @Column({ type: 'varchar', length: 100, nullable: false })
    municipality: string;
    @Column({ type: 'varchar', length: 100, nullable: true })
    neighborhood: string | null;
    @Column({ type: 'varchar', length: 100, nullable: false })
    city: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    state: string;  
    @Column({ type: 'varchar', length: 10, nullable: false, name: 'postal_code' })
    postalCode: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    country: string;
    @Column({ type: 'text', nullable: true })
    reference: string|null;

    @OneToOne('BranchOfficeOrmEntity', (branch: BranchOfficeOrmEntity)=> branch.address)
    branchOffice: BranchOfficeOrmEntity | null;
    @OneToOne('EmployeeOrmEntity', (employee: EmployeeOrmEntity)=>employee.address)
    employee: EmployeeOrmEntity | null;
    @OneToOne('SuplierOrmEntity', (suplier: SuplierOrmEntity)=> suplier.address)
    suplier: SuplierOrmEntity | null;
    @OneToOne('CustomerOrmEntity', (customer: CustomerOrmEntity)=> customer.address)
    customer: CustomerOrmEntity | null;
  }