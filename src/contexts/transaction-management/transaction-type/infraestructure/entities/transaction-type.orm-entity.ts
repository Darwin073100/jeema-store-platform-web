import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";
import { TransactionOrmEntity } from "src/contexts/transaction-management/transaction/infraestructure/entities/transaction.orm-entity";

@Entity({ name: 'transaction_type'})
export class TransactionTypeOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'transaction_type_id'})
    transactionTypeId: bigint;
    @Column({type: 'varchar', length: 100, nullable: false, unique: true, name: 'name'})
    name: string;
    @Column({type: 'text', nullable: true, name: 'description'})
    description: string | null;
    @Column({type: 'enum', enum: AccountTypeEnum, name: 'account_type', nullable: false})
    accountType: AccountTypeEnum;
    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    @OneToMany(()=> TransactionOrmEntity, (item)=> item.transactionType)
    transactions: TransactionOrmEntity[];
}