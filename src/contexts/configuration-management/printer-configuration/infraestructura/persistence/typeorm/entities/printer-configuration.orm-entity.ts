import type { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Debe reflejar exactamente los valores de PrinterConnectionTypeEnum
 * (domain/value-objects/printer-connection-type.vo.ts) — es un enum nativo de Postgres, así que
 * cualquier cambio de valores requiere una migración.
 */
export enum PrinterConnectionTypeOrmEnum {
    QZ_OS_PRINTER = 'QZ_OS_PRINTER',
    QZ_NETWORK = 'QZ_NETWORK',
    QZ_USB = 'QZ_USB',
}

@Entity({ name: 'printer_configuration' })
export class PrinterConfigurationOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'printer_configuration_id' })
    printerConfigurationId: bigint;

    @Column({ type: 'bigint', name: 'branch_office_id', nullable: false })
    branchOfficeId: bigint;

    @Column({ type: 'varchar', length: 100, nullable: false })
    label: string;

    @Column({ type: 'enum', enum: PrinterConnectionTypeOrmEnum, name: 'connection_type', nullable: false })
    connectionType: PrinterConnectionTypeOrmEnum;

    @Column({ type: 'varchar', length: 250, nullable: false })
    target: string;

    @Column({ type: 'smallint', name: 'paper_width_mm', nullable: false })
    paperWidthMm: number;

    @Column({ type: 'boolean', name: 'auto_print_on_sale', nullable: false, default: false })
    autoPrintOnSale: boolean;

    @Column({ type: 'boolean', name: 'open_cash_drawer', nullable: false, default: false })
    openCashDrawer: boolean;

    @Column({ type: 'smallint', nullable: false, default: 1 })
    copies: number;

    @Column({ type: 'boolean', name: 'is_active', nullable: false, default: true })
    isActive: boolean;

    @ManyToOne('BranchOfficeOrmEntity', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'branch_office_id' })
    branchOffice: BranchOfficeOrmEntity | null;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
}
