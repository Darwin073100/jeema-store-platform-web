import { TemplateOrmEntity } from "@/shared/infrastructure/typeorm/template.orm-entity";
import { CashSessionOrmEntity } from "src/contexts/cash-management/cash-session/infraestructure/entities/cash-session.orm-entity";
import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cash_register')
export class CashRegisterOrmEntity extends TemplateOrmEntity {
    @PrimaryGeneratedColumn('increment', {type: 'bigint', name: 'cash_register_id'})
    cashRegisterId: bigint;
    @Column({type: 'bigint', nullable: false, name: 'branch_office_id'})
    branchOfficeId: bigint;
    @Column({type: 'varchar', length:150, name: 'name', nullable: false})
    name: string;
    @Column({type: 'boolean', default: true, name: 'is_active'})
    isActive: boolean;
    @ManyToOne(()=> BranchOfficeOrmEntity, (item)=> item.cashRegisters)
    @JoinColumn({name: 'branch_office_id'})
    branchOffice: BranchOfficeOrmEntity | null;
    @OneToMany(() => CashSessionOrmEntity, (cashSession) => cashSession.cashRegister)
    cashSessions: CashSessionOrmEntity[] | null;
}