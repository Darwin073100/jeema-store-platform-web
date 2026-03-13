import { SaleDetailRegisterDto } from "src/contexts/sale-management/sale-detail/application/dtos/sale-detail-register.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export class RegisterSaleDto {
  readonly branchOfficeId: bigint;
  readonly customerId: bigint;
  readonly employeeId: bigint;
  readonly subTotalAmount: number;
  readonly discountAmount: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly status: SaleStatusEnum;
  readonly notes: string |null;
  readonly saleDetails?: SaleDetailRegisterDto[] | null;

  constructor(
    branchOfficeId: bigint,
    customerId: bigint,
    employeeId: bigint,
    subTotalAmount: number,
    discountAmount: number,
    taxAmount: number,
    totalAmount: number,
    status: SaleStatusEnum,
    notes: string |null,
    saleDetails?: SaleDetailRegisterDto[] | null,
  ) {
    this.branchOfficeId = branchOfficeId;
    this.customerId = customerId;
    this.employeeId = employeeId;
    this.subTotalAmount = subTotalAmount;
    this.discountAmount = discountAmount;
    this.taxAmount = taxAmount;
    this.totalAmount = totalAmount;
    this.status = status;
    this.notes = notes;
    this.saleDetails = saleDetails;
    Object.freeze(this);
  }
}
