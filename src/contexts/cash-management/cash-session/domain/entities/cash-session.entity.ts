import { CashRegisterEntity } from "src/contexts/cash-management/cash-register/domain/entities/cash-register.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { CashSessionStartBalanceVO } from "../value-objets/cash-session-start-balance.vo";
import { CashSessionExpectedBalanceVO } from "../value-objets/cash-session-expected-balance.vo";
import { CashSessionActualBalanceVO } from "../value-objets/cash-session-actual-balance.vo";
import { CashSessionDifferenceVO } from "../value-objets/cash-session-difference.vo";
import { CashSessionClosingNotesVO } from "../value-objets/cash-session-closing-notes.vo";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";

export class CashSessionEntity {
    private readonly _cashSessionId: bigint;
    private _cashRegisterId: bigint;
    private _employeeId: bigint;
    private _startTime: Date;
    private _startBalance: CashSessionStartBalanceVO;
    private _endTime: Date | null;
    private _expectedBalance: CashSessionExpectedBalanceVO;
    private _actualBalance: CashSessionActualBalanceVO;
    private _diference: CashSessionDifferenceVO;
    private _isClosed: boolean;
    private _closingNotes: CashSessionClosingNotesVO;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _cashRegister: CashRegisterEntity | null;
    private _employee: EmployeeEntity | null;
    private _transactions: TransactionEntity[] | null;
    private _sales: SaleEntity[] | null;

    constructor(
        cashSessionId: bigint,
        cashRegisterId: bigint,
        employeeId: bigint,
        startTime: Date,
        startBalance: number,
        endTime: Date | null,
        expectedBalance: number | null,
        actualBalance: number | null,
        diference: number | null,
        isClosed: boolean,
        closingNotes: string | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        cashRegister: CashRegisterEntity | null,
        employee: EmployeeEntity | null,
        transactions: TransactionEntity[] | null,
        sales: SaleEntity[] | null,
    ){
        this._cashSessionId = cashSessionId;
        this._cashRegisterId = cashRegisterId;
        this._employeeId = employeeId;
        this._startTime = startTime;
        this._startBalance = CashSessionStartBalanceVO.create(startBalance);
        this._endTime = endTime;
        this._expectedBalance = CashSessionExpectedBalanceVO.create(expectedBalance);
        this._actualBalance = CashSessionActualBalanceVO.create(actualBalance);
        this._diference = CashSessionDifferenceVO.create(diference);
        this._isClosed = isClosed;
        this._closingNotes = CashSessionClosingNotesVO.create(closingNotes);
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._cashRegister = cashRegister;
        this._employee = employee;
        this._transactions = transactions;
        this._sales = sales;
    }

    public static create(
        cashRegisterId: bigint,
        employeeId: bigint,
        startTime: Date,
        startBalance: number,
    ){
        return new CashSessionEntity(
            BigInt(0),
            cashRegisterId,
            employeeId,
            startTime,
            startBalance,
            null,
            null,
            null,
            null,
            false,
            null,
            new Date(),
            null,
            null,
            null,
            null,
            null,
            null
        );
    }
    public static reconstitute(
        cashSessionId: bigint,
        cashRegisterId: bigint,
        employeeId: bigint,
        startTime: Date,
        startBalance: number,
        endTime: Date | null,
        expectedBalance: number | null,
        actualBalance: number | null,
        diference: number | null,
        isClosed: boolean,
        closingNotes: string | null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        cashRegister: CashRegisterEntity | null,
        employee: EmployeeEntity | null,
        transactions: TransactionEntity[] | null,
        sales: SaleEntity[] | null,
    ){
        return new CashSessionEntity(
            cashSessionId,
            cashRegisterId,
            employeeId,
            startTime,
            startBalance,
            endTime,
            expectedBalance,
            actualBalance,
            diference,
            isClosed,
            closingNotes,
            createdAt,
            updatedAt,
            deletedAt,
            cashRegister,
            employee,
            transactions,
            sales,
        );
    }

    get cashSessionId(): bigint {
        return this._cashSessionId;
    }
    get cashRegisterId(): bigint {
        return this._cashRegisterId;
    }
    get employeeId(): bigint {
        return this._employeeId;
    }
    get startTime(): Date {
        return this._startTime;
    }
    get startBalance(): number {
        return this._startBalance.value;
    }
    get endTime(): Date | null {
        return this._endTime;
    }
    get expectedBalance(): number | null {
        return this._expectedBalance.value;
    }
    get actualBalance(): number | null {
        return this._actualBalance.value;
    }
    get diference(): number | null {
        return this._diference.value;
    }
    get isClosed(): boolean {
        return this._isClosed;
    }
    get closingNotes(): string | null {
        return this._closingNotes.value;
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
    get cashRegister(): CashRegisterEntity | null {
        return this._cashRegister;
    }
    get employee(): EmployeeEntity | null {
        return this._employee;
    }
    get transactions(): TransactionEntity[] | null{
        return this._transactions;
    }
    get sales(): SaleEntity[] | null{
        return this._sales;
    }

    public updateStartTime(value: Date){
        this._startTime = value;
    }
    public updateStartBalance(value: number){
        this._startBalance = CashSessionStartBalanceVO.create(value);
    }
    public updateEndTime(value: Date | null){
        this._endTime = value;
    }
    public updateExpectedBalance(value: number | null) {
        this._expectedBalance = CashSessionExpectedBalanceVO.create(value);
    }
    public updateActualBalance(value: number | null) {
        this._actualBalance = CashSessionActualBalanceVO.create(value);
    }
    public updateDiference(value: number | null) {
        this._diference = CashSessionDifferenceVO.create(value);
    }
    public updateIsClosed(value: boolean) {
        this._isClosed = value;
    }
    public updateClosingNotes(value: string | null) {
        this._closingNotes = CashSessionClosingNotesVO.create(value);
    }
}