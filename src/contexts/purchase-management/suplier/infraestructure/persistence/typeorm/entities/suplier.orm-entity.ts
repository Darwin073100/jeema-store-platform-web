import { AddressOrmEntity } from '@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity';
import { TemplateOrmEntity } from '@/shared/infrastructure/typeorm/template.orm-entity';
import { EstablishmentOrmEntity } from 'src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity';
import { LotOrmEntity } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('suplier')
export class SuplierOrmEntity extends TemplateOrmEntity {
  @PrimaryGeneratedColumn('increment', {name: 'suplier_id', type: 'bigint' })
  suplierId: bigint;
  @Column({type: 'bigint', name: 'establishment_id'})
  establishmentId: bigint;
  @Column({ type: 'bigint', name: 'address_id', nullable: true })
  addressId: bigint | null;
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 25, name: 'phone_number', nullable: true })
  phoneNumber: string | null;
  @Column({ type: 'varchar', length: 13, name: 'rfc', nullable: true, unique:true })
  rfc: string | null;
  @Column({ type: 'varchar', length: 100, name: 'contact_person', nullable: true })
  contactPerson: string | null;
  @Column({ type: 'varchar', length: 100, name: 'email', nullable: true, unique: true })
  email: string | null;
  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: string | null;
  
  @JoinColumn({ name: 'establishment_id' })
  @ManyToOne(()=> EstablishmentOrmEntity, (item)=> item.supliers)
  establishment: EstablishmentOrmEntity | null;
  @JoinColumn({ name: 'address_id' })
  @OneToOne(() => AddressOrmEntity, (address) => address.suplier, { cascade: true, onDelete: 'CASCADE' })
  address: AddressOrmEntity | null;
  @OneToMany(()=> LotOrmEntity, (item)=> item.suplier)
  lots: LotOrmEntity[] | null;
}
