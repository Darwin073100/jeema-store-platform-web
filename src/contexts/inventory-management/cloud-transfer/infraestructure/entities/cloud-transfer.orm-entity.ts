import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { CloudTransferItemOrmEntity } from "./cloud-transfer-item.orm-entity";

@Entity({ name: 'cloud_transfer' })
@Index(['fromBranchOfficeId', 'status'])
@Index(['toBranchOfficeId', 'status'])
@Index(['direction'])
export class CloudTransferOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'cloud_transfer_id' })
    cloudTransferId: bigint;
    @Column({ type: 'bigint', name: 'remote_cloud_transfer_id', nullable: true, unique: true })
    remoteCloudTransferId: bigint | null;
    @Column({ type: 'enum', enum: CloudTransferDirectionEnum, name: 'direction' })
    direction: CloudTransferDirectionEnum;
    @Column({ type: 'bigint', name: 'from_branch_office_id', nullable: true })
    fromBranchOfficeId: bigint | null;
    @Column({ type: 'bigint', name: 'from_cloud_branch_office_id' })
    fromCloudBranchOfficeId: bigint;
    @Column({ type: 'bigint', name: 'to_branch_office_id', nullable: true })
    toBranchOfficeId: bigint | null;
    @Column({ type: 'bigint', name: 'to_cloud_branch_office_id' })
    toCloudBranchOfficeId: bigint;
    @Column({ type: 'enum', enum: CloudTransferStatusEnum, name: 'status' })
    status: CloudTransferStatusEnum;
    @Column({ type: 'varchar', length: 500, name: 'shipment_notes', nullable: true })
    shipmentNotes: string | null;
    @Column({ type: 'text', name: 'resolution_notes', nullable: true })
    resolutionNotes: string | null;
    @Column({ type: 'varchar', length: 1000, name: 'error_message', nullable: true })
    errorMessage: string | null;
    @Column({ type: 'bigint', name: 'requested_by_employee_id', nullable: true })
    requestedByEmployeeId: bigint | null;
    @Column({ type: 'bigint', name: 'processed_by_employee_id', nullable: true })
    processedByEmployeeId: bigint | null;
    @Column({ type: 'timestamptz', name: 'last_synced_at', nullable: true })
    lastSyncedAt: Date | null;
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    // Sin deletedAt: cancelar es un status (CANCELLED), no un soft-delete.

    @ManyToOne(() => BranchOfficeOrmEntity)
    @JoinColumn({ name: 'from_branch_office_id' })
    fromBranchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(() => BranchOfficeOrmEntity)
    @JoinColumn({ name: 'to_branch_office_id' })
    toBranchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(() => EmployeeOrmEntity)
    @JoinColumn({ name: 'requested_by_employee_id' })
    requestedByEmployee: EmployeeOrmEntity | null;
    @ManyToOne(() => EmployeeOrmEntity)
    @JoinColumn({ name: 'processed_by_employee_id' })
    processedByEmployee: EmployeeOrmEntity | null;
    // Tipo `any[]` deliberado (no `CloudTransferItemOrmEntity[]`): evita que `emitDecoratorMetadata` emita
    // una referencia eager a esa clase en el tipo de esta propiedad, lo que dispara un TDZ ("Cannot access
    // X before initialization") en el import circular ida-y-vuelta entre este archivo y
    // `cloud-transfer-item.orm-entity.ts` bajo el transform ESM-interop de Jest — la misma familia de bug
    // que CLAUDE.md documenta para Turbopack ("mishandles circular imports between TypeORM entities con
    // relaciones bidireccionales"). Se probaron primero `Relation<T>` y un `import(...)` inline type-only;
    // ambos siguen disparando TS1272 bajo `isolatedModules` + `emitDecoratorMetadata` de este tsconfig (el
    // checker de aislamiento de módulos marca la firma decorada igual, sin importar la sintaxis de import
    // usada). `any[]` es lo único que satisface a la vez a Jest (sin referencia de clase eager) y a `tsc`
    // (sin referencia de tipo externo en absoluto). Sin impacto en runtime/columnas/migración — el
    // resolver de la relación (`() => CloudTransferItemOrmEntity`) y el `JoinColumn` no cambian.
    @OneToMany(() => CloudTransferItemOrmEntity, (item) => item.cloudTransfer, { cascade: true })
    items: any[];
}
