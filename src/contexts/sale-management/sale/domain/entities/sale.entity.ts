import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { CustomerEntity } from "src/contexts/sale-management/customer/domain/entities/customer.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { DomainEvent } from "src/shared/domain/events/domain-events";
import { SaleDiscountAmountVO } from '../value-objects/sale-discount-amount.vo';
import { SaleNotesVO } from '../value-objects/sale-notes.vo';
import { SaleSubTotalAmountVO } from '../value-objects/sale-sub-total-amount.vo';
import { SaleTaxAmountVO } from '../value-objects/sale-tax-amount.vo';
import { SaleTotalAmountVO } from '../value-objects/sale-total-amount.vo';
import { SaleDetailEntity } from "src/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity";
import { SaleStatusEnum } from "../enums/sale-status.enum";
import { SalePaymentEntity } from "src/contexts/sale-management/sale-payment/domain/entities/sale-payment.entity";
import { TransactionEntity } from "src/contexts/transaction-management/transaction/domain/entities/transaction.entity";
import { SaleInAmountVO } from "../value-objects/sale-in-amount.vo";
import { SaleOutAmountVO } from "../value-objects/sale-out-amount.vo";
import { CashSessionEntity } from "src/contexts/cash-management/cash-session/domain/entities/cash-session.entity";

export class SaleEntity {
  private readonly _saleId: bigint;
  private _branchOfficeId: bigint;
  private _customerId: bigint;
  private _employeeId: bigint;
  private _cashSessionId: bigint;
  private _subTotalAmount: SaleSubTotalAmountVO;
  private _discountAmount: SaleDiscountAmountVO;
  private _taxAmount: SaleTaxAmountVO;
  private _totalAmount: SaleTotalAmountVO;
  private _inAmount: SaleInAmountVO;
  private _outAmount: SaleOutAmountVO;
  private _status: SaleStatusEnum;
  private _notes: SaleNotesVO;
  private _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  private _branchOffice: BranchOfficeEntity | null;
  private _customer: CustomerEntity | null;
  private _employee: EmployeeEntity | null;
  private _saleDetails: SaleDetailEntity[] | null;
  private _salePayments: SalePaymentEntity[] | null;
  private _transactions: TransactionEntity[] | null;
  private _cashSession: CashSessionEntity | null;

  private constructor(
    saleId: bigint,
    branchOfficeId: bigint,
    customerId: bigint,
    employeeId: bigint,
    cashSessionId: bigint,
    subTotalAmount: SaleSubTotalAmountVO,
    discountAmount: SaleDiscountAmountVO,
    taxAmount: SaleTaxAmountVO,
    totalAmount: SaleTotalAmountVO,
    inAmount: SaleInAmountVO,
    outAmount: SaleOutAmountVO,
    status: SaleStatusEnum,
    notes: SaleNotesVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    transactions: TransactionEntity[] | null,
    branchOffice: BranchOfficeEntity | null,
    customer: CustomerEntity | null,
    employee: EmployeeEntity | null,
    saleDetails: SaleDetailEntity[] | null,
    salePayments: SalePaymentEntity[] | null,
    cashSession: CashSessionEntity | null,
  ) {
    this._saleId = saleId;
    this._branchOfficeId = branchOfficeId;
    this._customerId= customerId;
    this._employeeId = employeeId;
    this._cashSessionId = cashSessionId;
    this._subTotalAmount = subTotalAmount;
    this._discountAmount = discountAmount;
    this._taxAmount= taxAmount;
    this._totalAmount = totalAmount;
    this._inAmount = inAmount;
    this._outAmount = outAmount;
    this._status = status;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._branchOffice = branchOffice;
    this._customer = customer;
    this._employee = employee;
    this._saleDetails = saleDetails;
    this._salePayments = salePayments;
    this._transactions = transactions;
    this._cashSession = cashSession;
  }

  static create(
    branchOfficeId: bigint,
    customerId: bigint,
    employeeId: bigint,
    cashSessionId: bigint,
    subTotalAmount: number,
    discountAmount: number,
    taxAmount: number,
    totalAmount: number,
    inAmount: number,
    outAmount: number,
    status: SaleStatusEnum,
    notes: string | null,
    saleDetails: SaleDetailEntity[] | null,
    salePayments: SalePaymentEntity[] | null
  ): SaleEntity {
    const paymentMethod = new SaleEntity(
      BigInt(new Date().getTime()),
      branchOfficeId,
      customerId,
      employeeId,
      cashSessionId,
      SaleSubTotalAmountVO.create(subTotalAmount),
      SaleDiscountAmountVO.create(discountAmount),
      SaleTaxAmountVO.create(taxAmount),
      SaleTotalAmountVO.create(totalAmount),
      SaleInAmountVO.create(inAmount),
      SaleOutAmountVO.create(outAmount),
      status,
      SaleNotesVO.create(notes),
      new Date(),
      null,
      null,
      null,
      null,
      null,
      null,
      saleDetails,
      salePayments,
      null,
    );
    return paymentMethod;
  }

  static reconstitute(
    saleId: bigint,
    branchOfficeId: bigint,
    customerId: bigint,
    employeeId: bigint,
    cashSessionId: bigint,
    subTotalAmount: number,
    discountAmount: number,
    taxAmount: number,
    totalAmount: number,
    inAmount: number,
    outAmount: number,
    status: SaleStatusEnum,
    notes: string |null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    transactions: TransactionEntity[] | null,
    branchOffice: BranchOfficeEntity | null,
    customer: CustomerEntity | null,
    employee: EmployeeEntity | null,
    saleDetails: SaleDetailEntity[] | null,
    salePayments: SalePaymentEntity[] | null,
    cashSession: CashSessionEntity | null,
  ): SaleEntity {
    return new SaleEntity(
      saleId,
      branchOfficeId,
      customerId,
      employeeId,
      cashSessionId,
      SaleSubTotalAmountVO.create(subTotalAmount),
      SaleDiscountAmountVO.create(discountAmount),
      SaleTaxAmountVO.create(taxAmount),
      SaleTotalAmountVO.create(totalAmount),
      SaleInAmountVO.create(inAmount),
      SaleOutAmountVO.create(outAmount),
      status,
      SaleNotesVO.create(notes),
      createdAt,
      updatedAt,
      deletedAt,
      transactions,
      branchOffice,
      customer,
      employee,
      saleDetails,
      salePayments,
      cashSession,
    );
  }

  // Getters
  get saleId(): bigint {
    return this._saleId;
  }
  get branchOfficeId(): bigint {
    return this._branchOfficeId;
  }
  get customerId(): bigint {
    return this._customerId;
  }
  get employeeId(): bigint {
    return this._employeeId;
  }
  get cashSessionId(): bigint {
    return this._cashSessionId;
  }
  get subTotalAmount(){
    return this._subTotalAmount.value;
  }
  get discountAmount(){
    return this._discountAmount.value;
  }
  get totalAmount(){
    return this._totalAmount.value;
  }
  get inAmount(){
    return this._inAmount.value;
  }
  get outAmount(){
    return this._outAmount.value;
  }
  get taxAmount(){
    return this._taxAmount.value;
  }
  get status(){
    return this._status;
  }
  get notes(){
    return this._notes.value;
  }
  get createdAt(){
    return this._createdAt;
  }
  get updatedAt(){
    return this._updatedAt;
  }
  get deletedAt() {
    return this._deletedAt;
  }
  get branchOffice() {
    return this._branchOffice;
  }
  get customer() {
    return this._customer;
  }
  get employee(){
    return this._employee;
  }
  get saleDetails() {
    return this._saleDetails;
  }
  get salePayments() {
    return this._salePayments;
  }
  get transactions(){
    return this._transactions;
  }
  get cashSession(){
    return this._cashSession;
  }

  updateEmployeeId(value: bigint){
    this._employeeId = value;
  }
  updateCustomerId(value: bigint){
    this._customerId = value;
  }
  updateCashSessionId(value: bigint){
    this._cashSessionId = value;
  }
  updateSubTotalAmount(value: number){
    this._subTotalAmount = SaleSubTotalAmountVO.create(value);
  }
  updateDiscountAmount(value: number){
    this._discountAmount = SaleDiscountAmountVO.create(value);
  }
  updateTotalAmount(value: number){
    this._totalAmount = SaleTotalAmountVO.create(value);
  }
  updateInAmount(value: number){
    this._inAmount = SaleInAmountVO.create(value);
  }
  updateOutAmount(value: number){
    this._outAmount = SaleOutAmountVO.create(value);
  }
  updateTaxAmount(value: number){
    this._taxAmount = SaleTaxAmountVO.create(value);
  }
  updateStatus(value: SaleStatusEnum){
    this._status = value;
  }
  updateNotes(value: string | null){
    this._notes = SaleNotesVO.create(value);
  }
  updateCreatedAt(date: Date){
    this._createdAt = date;
  }
}
