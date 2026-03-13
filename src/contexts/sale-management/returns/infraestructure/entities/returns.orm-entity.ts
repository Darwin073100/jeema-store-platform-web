import { TemplateOrmEntity } from "@/shared/infrastructure/typeorm/template.orm-entity";
import { EmployeeOrmEntity } from "src/contexts/employee-management/employee/infraestruture/persistence/typeorm/entities/employee-orm-entity";
import { InventoryOrmEntity } from "src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity";
import { SaleDetailOrmEntity } from "src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/entities/sale-detail.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('returns')
export class ReturnsOrmEntity extends TemplateOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'returns_id' })
    returnsId: bigint;
    @Column({ type: 'bigint', name: 'sale_detail_id' })
    saleDetailId: bigint;
    @Column({ type: 'bigint', name: 'employee_id' })
    employeeId: bigint;
    @Column({ type: 'bigint', name: 'inventory_id' })
    inventoryId: bigint;
    @Column({ type: 'decimal', precision: 18, scale: 3, name: 'quantity_return' })
    quantityReturn: number;
    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'amount_return', default: 0 })
    amountReturn: number;
    @Column({ type: 'text', name: 'notes', nullable: true })
    notes: string | null;
    
    @ManyToOne(() => SaleDetailOrmEntity, item => item.returns)
    @JoinColumn({ name: 'sale_detail_id' })
    saleDetail: SaleDetailOrmEntity | null;
    @ManyToOne(() => EmployeeOrmEntity, item => item.returns)
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeOrmEntity | null;
    @ManyToOne(() => InventoryOrmEntity, item => item.returns)
    @JoinColumn({ name: 'inventory_id' })
    inventory: InventoryOrmEntity | null;
}