import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { TransferStatusEnum } from "../../domain/enums/transfer-status.enum";
import { BranchOfficeOrmEntity } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/entities/branch-office.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { InventoryOrmEntity } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'transfer'})
export class TransferOrmEntity{
    @PrimaryGeneratedColumn('increment', {type: 'bigint', name: 'transfer_id'})
    transferId: bigint;
    @Column({type: 'bigint', name: 'inventory_id', nullable: true})
    inventoryId: bigint | null;
    @Column({type: 'bigint', name: 'from_branch_office_id', nullable: true})
    fromBranchOfficeId: bigint | null;
    @Column({type: 'enum', enum: LocationEnum, name: 'from_location', nullable: true })
    fromLocation: LocationEnum | null;
    @Column({type: 'bigint', name: 'to_branch_office_id', nullable: false})
    toBranchOfficeId: bigint;
    @Column({type: 'enum', enum: LocationEnum, name: 'to_location', nullable: false })
    toLocation: LocationEnum;
    @Column({type: 'decimal', precision: 18, scale: 3, name: 'quantity_required', nullable: false})
    quantityRequired: number;
    @Column({type: 'decimal', precision: 18, scale: 3, name: 'quantity_transferred', nullable: true})
    quantityTransferred: number | null;
    @Column({type: 'bigint', name: 'requested_by_employee_id', nullable: false})
    requestedByEmployeeId: bigint;
    @Column({type: 'bigint', name: 'approved_by_employee_id', nullable: true})
    approvedByEmployeeId: bigint | null;
    @Column({type: 'bigint', name: 'shipped_by_employee_id', nullable: true})
    shippedByEmployeeId: bigint | null;
    @Column({type: 'bigint', name: 'received_by_employee_id', nullable: true})
    receivedByEmployeeId: bigint | null;
    @Column({type: 'timestamptz', name: 'transfer_request_date', nullable: false})
    transferRequestDate: Date;
    @Column({type: 'timestamptz', name: 'transfer_shipped_date', nullable: true})
    transferShippedDate: Date | null;
    @Column({type: 'timestamptz', name: 'transfer_received_date', nullable: true})
    transferReceivedDate: Date | null;
    @Column({type: 'enum', name: 'status', enum: TransferStatusEnum, nullable: false})
    status: TransferStatusEnum;
    @Column({type: 'text', name: 'notes', nullable: true})
    notes: string | null;
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date | null;
    @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
    @ManyToOne(()=> InventoryOrmEntity, (item)=> item.transfers)
    @JoinColumn({name: 'inventory_id'})
    inventory: InventoryOrmEntity | null;
    @ManyToOne(()=> BranchOfficeOrmEntity, (item)=> item.fromTransfers)
    @JoinColumn({name: 'from_branch_office_id'})
    fromBranchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(()=> BranchOfficeOrmEntity, (item)=> item.toTransfers)
    @JoinColumn({name: 'to_branch_office_id'})
    toBranchOffice: BranchOfficeOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, (item)=> item.requestedTransfers)
    @JoinColumn({name: 'requested_by_employee_id'})
    requestedByEmployee: EmployeeOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, (item)=> item.approvedTransfers)
    @JoinColumn({name: 'approved_by_employee_id'})
    approvedByEmployee: EmployeeOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, (item)=> item.shippedTransfers)
    @JoinColumn({name: 'shipped_by_employee_id'})
    shippedByEmployee: EmployeeOrmEntity | null;
    @ManyToOne(()=> EmployeeOrmEntity, (item)=> item.receivedTransfers)
    @JoinColumn({name: 'received_by_employee_id'})
    receivedByEmployee: EmployeeOrmEntity | null;
}