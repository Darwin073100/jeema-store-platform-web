import { AddressOrmEntity } from '@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { SaleOrmEntity } from 'src/contexts/sale-management/sale/infraestructure/persistence/typeorm/entities/sale.orm-entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('customer')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('increment', { name: 'customer_id', type: 'bigint' })
  customerId: bigint;
  @Column({type: 'bigint', name: 'establishment_id', nullable: true})
  establishmentId?: bigint | null;
  @Column({ type: 'varchar', length: 150, nullable: false , name: 'first_name'})
  firstName: string;
  @Column({type: 'boolean', nullable: false, name: 'sale_default' })
  saleDefault: boolean;
  @Column({ type: 'varchar', length: 100, nullable: true , name: 'last_name'})
  lastName?: string|null;
  @Column({ type: 'varchar', length: 150, nullable: true , name: 'company_name'})
  companyName?: string|null;
  @Column({ type: 'varchar', length: 25, name: 'phone_number', nullable: true })
  phoneNumber?: string|null;
  @Column({ type: 'varchar', length: 13, name: 'rfc', nullable: true })
  rfc?: string | null;
  @Column({ type: 'varchar', length: 100, name: 'email', nullable: true, unique: true })
  email?: string | null;
  @Column({ type: 'varchar', name: 'customer_type', length: 50, nullable: true })
  customerType?: string | null;
  @Column({ type: 'bigint', name: 'address_id', nullable: true, unique: true })
  addressId?: bigint|null;
  
  @JoinColumn({ name: 'address_id' })
  @OneToOne(() => AddressOrmEntity, (address) => address.branchOffice, { cascade: true, eager: true, onDelete: 'CASCADE' })
  address?: AddressOrmEntity|null;
  @ManyToOne(()=> EstablishmentOrmEntity, (establishment)=> establishment.customers)
  @JoinColumn({name: 'establishment_id'})
  establishment?: EstablishmentOrmEntity | null;
  @OneToMany(() => SaleOrmEntity, item => item.customer)
  sales?: SaleOrmEntity[];
  
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
