import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { TransferQuantityRequiredVO } from "../value-objets/transfer-quantity-required.vo";
import { TransferQuantityTransferredVO } from "../value-objets/transfer-quantity-transferred.vo";
import { TransferStatusEnum } from "../enums/transfer-status.enum";
import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { InventoryEntity } from "src/contexts/inventory-management/inventory/domain/entities/inventory.entity";

export class TransferEntity {
    private readonly _transferId: bigint;
    private _inventoryId: bigint | null;
    private _fromBranchOfficeId: bigint | null;
    private _fromLocation: LocationEnum | null;
    private _toBranchOfficeId: bigint;
    private _toLocation: LocationEnum;
    private _quantityRequired: TransferQuantityRequiredVO;
    private _quantityTransferred: TransferQuantityTransferredVO;
    private _requestedByEmployeeId: bigint;
    private _approvedByEmployeeId: bigint | null;
    private _shippedByEmployeeId: bigint | null;
    private _receivedByEmployeeId: bigint | null;
    private _transferRequestDate: Date;
    private _transferShippedDate: Date | null;
    private _transferReceivedDate: Date | null;
    private _status: TransferStatusEnum;
    private _notes: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _inventory: InventoryEntity | null;
    private _fromBranchOffice: BranchOfficeEntity | null;
    private _toBranchOffice: BranchOfficeEntity | null;
    private _requestedByEmployee: EmployeeEntity | null;
    private _approvedByEmployee: EmployeeEntity | null;
    private _shippedByEmployee: EmployeeEntity | null;
    private _receivedByEmployee: EmployeeEntity | null;

    private constructor(
        transferId: bigint,
        inventoryId: bigint | null,
        fromBranchOfficeId: bigint | null,
        fromLocation: LocationEnum | null,
        toBranchOfficeId: bigint,
        toLocation: LocationEnum,
        quantityRequired: number,
        quantityTransferred: number | null,
        requestedByEmployeeId: bigint,
        approvedByEmployeeId: bigint | null,
        shippedByEmployeeId: bigint | null,
        receivedByEmployeeId: bigint | null,
        transferRequestDate: Date,
        transferShippedDate: Date | null,
        transferReceivedDate: Date | null,
        status: TransferStatusEnum,
        notes: string | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        inventory: InventoryEntity | null,
        fromBranchOffice: BranchOfficeEntity | null,
        toBranchOffice: BranchOfficeEntity | null,
        requestedByEmployee: EmployeeEntity | null,
        approvedByEmployee: EmployeeEntity | null,
        shippedByEmployee: EmployeeEntity | null,
        receivedByEmployee: EmployeeEntity | null,
    ){
        this._transferId = transferId;
        this._inventoryId = inventoryId;
        this._fromBranchOfficeId = fromBranchOfficeId;
        this._fromLocation = fromLocation;
        this._toBranchOfficeId = toBranchOfficeId;
        this._toLocation = toLocation;
        this._quantityRequired = TransferQuantityRequiredVO.create(quantityRequired);
        this._quantityTransferred = TransferQuantityTransferredVO.create(quantityTransferred),
        this._requestedByEmployeeId = requestedByEmployeeId;
        this._approvedByEmployeeId = approvedByEmployeeId;
        this._shippedByEmployeeId = shippedByEmployeeId;
        this._receivedByEmployeeId = receivedByEmployeeId;
        this._transferRequestDate = transferRequestDate;
        this._transferShippedDate = transferShippedDate;
        this._transferReceivedDate = transferReceivedDate;
        this._status = status;
        this._notes = notes;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._inventory = inventory;
        this._fromBranchOffice = fromBranchOffice;
        this._toBranchOffice = toBranchOffice;
        this._requestedByEmployee = requestedByEmployee;
        this._approvedByEmployee = approvedByEmployee;
        this._shippedByEmployee = shippedByEmployee;
        this._receivedByEmployee = receivedByEmployee;
    }

    public static create(
        inventoryId: bigint | null,
        fromBranchOfficeId: bigint | null,
        fromLocation: LocationEnum | null,
        toBranchOfficeId: bigint,
        toLocation: LocationEnum,
        quantityRequired: number,
        quantityTransferred: number | null,
        requestedByEmployeeId: bigint,
        approvedByEmployeeId: bigint | null,
        shippedByEmployeeId: bigint | null,
        receivedByEmployeeId: bigint | null,
        transferRequestDate: Date,
        transferShippedDate: Date | null,
        transferReceivedDate: Date | null,
        status: TransferStatusEnum,
        notes: string | null,
    ){
        return new TransferEntity(
            BigInt(0),
            inventoryId,
            fromBranchOfficeId,
            fromLocation,
            toBranchOfficeId,
            toLocation,
            quantityRequired,
            quantityTransferred,
            requestedByEmployeeId,
            approvedByEmployeeId,
            shippedByEmployeeId,
            receivedByEmployeeId,
            transferRequestDate,
            transferShippedDate,
            transferReceivedDate,
            status,
            notes,
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        );
    }
    public static reconstitute(
        transferId: bigint,
        inventoryId: bigint | null,
        fromBranchOfficeId: bigint | null,
        fromLocation: LocationEnum | null,
        toBranchOfficeId: bigint,
        toLocation: LocationEnum,
        quantityRequired: number,
        quantityTransferred: number | null,
        requestedByEmployeeId: bigint,
        approvedByEmployeeId: bigint | null,
        shippedByEmployeeId: bigint | null,
        receivedByEmployeeId: bigint | null,
        transferRequestDate: Date,
        transferShippedDate: Date | null,
        transferReceivedDate: Date | null,
        status: TransferStatusEnum,
        notes: string | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        inventory: InventoryEntity | null,
        fromBranchOffice: BranchOfficeEntity | null,
        toBranchOffice: BranchOfficeEntity | null,
        requestedByEmployee: EmployeeEntity | null,
        approvedByEmployee: EmployeeEntity | null,
        shippedByEmployee: EmployeeEntity | null,
        receivedByEmployee: EmployeeEntity | null,
    ){
        return new TransferEntity(
            transferId,
            inventoryId,
            fromBranchOfficeId,
            fromLocation,
            toBranchOfficeId,
            toLocation,
            quantityRequired,
            quantityTransferred,
            requestedByEmployeeId,
            approvedByEmployeeId,
            shippedByEmployeeId,
            receivedByEmployeeId,
            transferRequestDate,
            transferShippedDate,
            transferReceivedDate,
            status,
            notes,
            createdAt,
            updatedAt,
            deletedAt,
            inventory,
            fromBranchOffice,
            toBranchOffice,
            requestedByEmployee,
            approvedByEmployee,
            shippedByEmployee,
            receivedByEmployee,
        );
    }

    get transferId(){
        return this._transferId
    }
    get inventoryId(): bigint | null{
        return this._inventoryId;   
    }
    get fromBranchOfficeId(): bigint | null{
        return this._fromBranchOfficeId;
    }
    get fromLocation(): LocationEnum | null{
        return this._fromLocation;
    }
    get toBranchOfficeId(): bigint{
        return this._toBranchOfficeId;
    }
    get toLocation(): LocationEnum{
        return this._toLocation;
    }
    get quantityRequired(): number{
        return this._quantityRequired.value;
    }
    get quantityTransferred(): number | null{
        return this._quantityTransferred.value;
    }
    get requestedByEmployeeId(): bigint{
        return this._requestedByEmployeeId;
    }
    get approvedByEmployeeId(): bigint | null{
        return this._approvedByEmployeeId;
    }
    get shippedByEmployeeId(): bigint | null{
        return this._shippedByEmployeeId;
    }
    get receivedByEmployeeId(): bigint | null{
        return this._receivedByEmployeeId;
    }
    get transferRequestDate(): Date{
        return this._transferRequestDate;
    }
    get transferShippedDate(): Date | null{
        return this._transferShippedDate;
    }
    get transferReceivedDate(): Date | null{
        return this._transferReceivedDate;
    }
    get status(): TransferStatusEnum{
        return this._status;
    }
    get notes(): string | null{
        return this._notes;
    }
    get createdAt(): Date{
        return this._createdAt;
    }
    get updatedAt(): Date | null{
        return this._updatedAt;
    }
    get deletedAt(): Date | null{
        return this._deletedAt;
    }
    get inventory(): InventoryEntity | null{
        return this._inventory;
    }
    get fromBranchOffice(): BranchOfficeEntity | null{
        return this._fromBranchOffice;
    }
    get toBranchOffice(): BranchOfficeEntity | null{
        return this._toBranchOffice;
    }
    get requestedByEmployee(): EmployeeEntity | null{
        return this._requestedByEmployee;
    }
    get approvedByEmployee(): EmployeeEntity | null{
        return this._approvedByEmployee;
    }
    get shippedByEmployee(): EmployeeEntity | null{
        return this._shippedByEmployee;
    }
    get receivedByEmployee(): EmployeeEntity | null{
        return this._receivedByEmployee;
    }

    updateInventoryId(value: bigint | null){
        this._inventoryId = value;   
    }
    updateFromBranchOfficeId(value: bigint | null){
        this._fromBranchOfficeId = value;
    }
    updateFromLocation(value: LocationEnum | null){
        this._fromLocation = value;
    }
    updateToBranchOfficeId(value: bigint){
        this._toBranchOfficeId = value;
    }
    updateToLocation(value: LocationEnum){
        return this._toLocation = value;
    }
    updateQuantityRequired( value : number){
        this._quantityRequired = TransferQuantityRequiredVO.create(value);
    }
    updateQuantityTransferred(value: number | null){
        this._quantityTransferred = TransferQuantityTransferredVO.create(value);
    }
    updateRequestedByEmployeeI(value: bigint){
        this._requestedByEmployeeId = value;
    }
    updateApprovedByEmployeeId(value: bigint | null){
        this._approvedByEmployeeId = value;
    }
    updateShippedByEmployeeId(value: bigint | null){
        this._shippedByEmployeeId = value;
    }
    updateReceivedByEmployeeId(value: bigint | null){
        this._receivedByEmployeeId = value;
    }
    updateTransferRequestDate(value: Date){
        this._transferRequestDate = value;
    }
    updateTransferShippedDate(value: Date | null){
        this._transferShippedDate = value;
    }
    updateTransferReceivedDate(value: Date | null){
        this._transferReceivedDate = value;
    }
    updateStatus(value: TransferStatusEnum){
        this._status = value;
    }
    updateNotes(value: string | null){
        this._notes = value;
    }
}