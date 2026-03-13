import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";
import { CustomerResponseDto } from "src/contexts/sale-management/customer/application/dtos/customer-response.dto";
import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { SaleDetailResponseDto } from "src/contexts/sale-management/sale-detail/application/dtos/sale-detail-response.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { SalePaymentResponseDTO } from "src/contexts/sale-management/sale-payment/application/dtos/sale-payment-response.dto";
import { CashSessionResponseDTO } from "src/contexts/cash-management/cash-session/application/dtos/cash-session-response.dto";

export class SaleResponseDto {
  readonly saleId: bigint;
  readonly branchOfficeId: bigint;
  readonly customerId: bigint;
  readonly employeeId: bigint;
  readonly cashSessionId: bigint;
  readonly subTotalAmount: number;
  readonly discountAmount: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly inAmount: number;
  readonly outAmount: number;
  readonly status: SaleStatusEnum;
  readonly notes: string |null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly branchOffice: BranchOfficeResponseDto | null;
  readonly customer: CustomerResponseDto | null;
  readonly employee: EmployeeResponseDto | null;
  readonly cashSession: CashSessionResponseDTO | null;
  readonly saleDetails: SaleDetailResponseDto[];
  readonly salePayments: SalePaymentResponseDTO[];

  constructor(
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
    branchOffice: BranchOfficeResponseDto | null,
    customer: CustomerResponseDto | null,
    employee: EmployeeResponseDto | null,
    cashSession: CashSessionResponseDTO | null,
    saleDetails: SaleDetailResponseDto[],
    salePayments: SalePaymentResponseDTO[],
  ) {
    this.saleId = saleId;
    this.branchOfficeId = branchOfficeId;
    this.customerId = customerId;
    this.employeeId = employeeId;
    this.cashSessionId = cashSessionId;
    this.subTotalAmount = subTotalAmount;
    this.discountAmount = discountAmount;
    this.taxAmount = taxAmount;
    this.totalAmount = totalAmount;
    this.inAmount = inAmount;
    this.outAmount = outAmount;
    this.status = status;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.branchOffice = branchOffice;
    this.customer = customer;
    this.employee = employee;
    this.cashSession = cashSession;
    this.saleDetails = saleDetails;
    this.salePayments = salePayments;
    Object.freeze(this);
  }
}
