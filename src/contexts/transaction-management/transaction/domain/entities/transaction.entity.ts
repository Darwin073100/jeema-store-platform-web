import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { TransactionTypeEntity } from "src/contexts/transaction-management/transaction-type/domain/entities/transaction-type.entity";
import { TransactionAmountVO } from "../value-objects/transaction-amount.vo";
import { TransactionDescriptionVO } from "../value-objects/transaction-description.vo";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";

export class TransactionEntity {
    private readonly _transactionId : bigint;
    private _transactionTypeId      : bigint;
    private _branchOfficeId         : bigint;
    private _purchaseId             : bigint | null;
    private _saleId                 : bigint | null;
    private _employeeId             : bigint;
    private _cashSessionId          : bigint | null;
    private _amount                 : TransactionAmountVO;
    private _description            : TransactionDescriptionVO;
    private readonly _createdAt     : Date;
    private _updatedAt              : Date | null;
    private _deletedAt              : Date | null;
    private _transactionType        : TransactionTypeEntity | null;
    private _branchOffice           : BranchOfficeEntity | null;
    private _sale                   : SaleEntity | null;
    private _employee               : EmployeeEntity | null;
    private _cashSession            : CashSessionEntity | null;

    constructor(
        transactionId     : bigint,
        transactionTypeId : bigint,
        branchOfficeId    : bigint,
        purchaseId        : bigint | null,
        saleId            : bigint | null,
        employeeId        : bigint,
        cashSessionId     : bigint | null,
        amount            : number,
        description       : string | null,
        createdAt         : Date,
        updatedAt         : Date | null,
        deletedAt         : Date | null,
        transactionType   : TransactionTypeEntity | null,
        branchOffice      : BranchOfficeEntity | null,
        sale              : SaleEntity | null,
        employee          : EmployeeEntity | null,
        cashSession       : CashSessionEntity | null,
    ){
        this._transactionId = transactionId;
        this._transactionTypeId = transactionTypeId;
        this._branchOfficeId = branchOfficeId;
        this._purchaseId = purchaseId;
        this._saleId = saleId;
        this._employeeId = employeeId;
        this._cashSessionId = cashSessionId;
        this._amount = TransactionAmountVO.create(amount);
        this._description = TransactionDescriptionVO.create(description);
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._transactionType = transactionType;
        this._branchOffice = branchOffice;
        this._sale = sale;
        this._employee = employee;
        this._cashSession = cashSession;
    }

    public static create(
        transactionTypeId : bigint,
        branchOfficeId     : bigint,
        purchaseId         : bigint | null,
        saleId             : bigint | null,
        employeeId         : bigint,
        cashSessionId      : bigint | null,
        amount             : number,
        description        : string | null,
    ){
        return new TransactionEntity(
            BigInt(0),
            transactionTypeId,
            branchOfficeId,
            purchaseId,
            saleId,
            employeeId,
            cashSessionId,
            amount,
            description,
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
    }
    public static reconstitute(
        transactionId     : bigint,
        transactionTypeId : bigint,
        branchOfficeId    : bigint,
        purchaseId        : bigint | null,
        saleId            : bigint | null,
        employeeId        : bigint,
        cashSessionId     : bigint | null,
        amount            : number,
        description       : string | null,
        createdAt         : Date,
        updatedAt         : Date | null,
        deletedAt         : Date | null,
        transactionType   : TransactionTypeEntity | null,
        branchOffice      : BranchOfficeEntity | null,
        sale              : SaleEntity | null,
        employee          : EmployeeEntity | null,
        cashSession       : CashSessionEntity | null,
    ){
        return new TransactionEntity(
            transactionId,
            transactionTypeId,
            branchOfficeId,
            purchaseId,
            saleId,
            employeeId,
            cashSessionId,
            amount,
            description,
            createdAt,
            updatedAt,
            deletedAt,
            transactionType,
            branchOffice,
            sale,
            employee,
            cashSession,
        );
    }

    get transactionId(){
        return this._transactionId;
    }
    get transactionTypeId(){
        return this._transactionTypeId
    }
    get branchOfficeId(){
        return this._branchOfficeId;
    }
    get purchaseId(){
        return this._purchaseId;
    }
    get saleId(){
        return this._saleId;
    }
    get employeeId(){
        return this._employeeId;
    }
    get cashSessionId(){
        return this._cashSessionId;
    }
    get amount(){
        return this._amount.value;
    }
    get description(){
        return this._description.value;
    }
    get createdAt(){
        return this._createdAt;
    }
    get updatedAt(){
        return this._updatedAt;
    }
    get deletedAt(){
        return this._deletedAt;
    }
    get transactionType(){
        return this._transactionType;
    }
    get branchOffice(){
        return this._branchOffice;
    }
    get sale(){
        return this._sale;
    }
    get employee(){
        return this._employee;
    }
    get cashSession(){
        return this._cashSession;
    }

    public updateAmount(amount: number){
        this._amount = TransactionAmountVO.create(amount);
        this._updatedAt = new Date();
    }

    public updateDescription(description: string | null){
        this._description = TransactionDescriptionVO.create(description);
        this._updatedAt = new Date();
    }
}