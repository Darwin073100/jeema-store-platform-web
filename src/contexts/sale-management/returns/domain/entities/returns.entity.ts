import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { SaleDetailEntity } from "src/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity";
import { ReturnsQuantityReturnVO } from "../value-objects/returns-quantity.vo";
import { ReturnsNotesVO } from "../value-objects/returns-notes.vo";
import { ReturnsAmountReturnVO } from "../value-objects/returns-amount-return.vo";

export class ReturnsEntity {
    private readonly _returnsId: bigint;
    private readonly _saleDetailId: bigint;
    private readonly _employeeId: bigint;
    private readonly _inventoryId: bigint;
    private _quantityReturn: ReturnsQuantityReturnVO;
    private _amountReturn: ReturnsAmountReturnVO;
    private _notes: ReturnsNotesVO;
    private _saleDetail: SaleDetailEntity | null;
    private _employee: EmployeeEntity | null;
    private _inventory: InventoryEntity | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;

    private constructor(
        returnsId: bigint,
        saleDetailId: bigint,
        employeeId: bigint,
        inventoryId: bigint,
        quantityReturn: ReturnsQuantityReturnVO,
        amountReturn: ReturnsAmountReturnVO,
        notes: ReturnsNotesVO,
        // Relaciones
        saleDetail: SaleDetailEntity | null,
        product: EmployeeEntity | null,
        inventory: InventoryEntity | null,
        // Campos de auditoría
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
    ) {
        this._returnsId = returnsId;
        this._saleDetailId = saleDetailId;
        this._employeeId = employeeId;
        this._inventoryId = inventoryId;
        this._quantityReturn = quantityReturn;
        this._amountReturn = amountReturn;
        this._notes = notes;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._saleDetail = saleDetail;
        this._employee = product;
        this._inventory = inventory;
    }

    // Getters
    get saleDetailId(): bigint {
        return this._saleDetailId;
    }
    get returnsId(): bigint {
        return this._returnsId;
    }
    get employeeId(): bigint {
        return this._employeeId;
    }
    get inventoryId(): bigint {
        return this._inventoryId;
    }
    get quantityReturn() {
        return this._quantityReturn.value;
    }
    public updateQuantity(quantity: number): void {
        this._quantityReturn = ReturnsQuantityReturnVO.create(quantity);
    }
    get amountReturn() {
        return this._amountReturn.value;
    }
    public updateReturnsAmountReturn(amountReturn: number): void {
        this._amountReturn = ReturnsAmountReturnVO.create(amountReturn);
    }
    get notes() {
        return this._notes.value;
    }
    public updateNotes(notes: string | null): void {
        this._notes = ReturnsNotesVO.create(notes);
    }
    get saleDetail(): SaleDetailEntity | null {
        return this._saleDetail;
    }
    get employee(): EmployeeEntity | null {
        return this._employee;
    }
    get inventory(): InventoryEntity | null {
        return this._inventory;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date | null {
        return this._updatedAt;
    }
    get deletedAt(): Date | null {
        return this._deletedAt;
    }

    public static create(
        saleDetailId: bigint,
        employeeId: bigint,
        inventoryItemId: bigint,
        quantityReturn: number,
        amountReturn: number,
        notes: string | null,
      ): ReturnsEntity {
        const returns = new ReturnsEntity(
          BigInt(0), // Generar un ID único (esto es solo un ejemplo, en un entorno real usarías un generador de IDs adecuado)
          saleDetailId,
          employeeId,
          inventoryItemId,
          ReturnsQuantityReturnVO.create(quantityReturn),
          ReturnsAmountReturnVO.create(amountReturn),
          ReturnsNotesVO.create(notes),
          null,
          null,
          null,
          new Date(),
          null,
          null,
        );
        return returns;
      }
    public static reconstitute(
        returnsId: bigint,
        saleDetailId: bigint,
        employeeId: bigint,
        inventoryItemId: bigint,
        quantityReturn: number,
        amountReturn: number,
        notes: string | null,
        saleDetail: SaleDetailEntity | null,
        employee: EmployeeEntity | null,
        inventory: InventoryEntity | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
      ): ReturnsEntity {
        const returns = new ReturnsEntity(
          returnsId,
          saleDetailId,
          employeeId,
          inventoryItemId,
          ReturnsQuantityReturnVO.create(quantityReturn),
          ReturnsAmountReturnVO.create(amountReturn),
          ReturnsNotesVO.create(notes),
          saleDetail,
          employee,
          inventory,
          createdAt,
          updatedAt,
          deletedAt,
        );
        return returns;
      }
}