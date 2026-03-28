import { AddDetailToSaleDto } from "@/contexts/sale-management/sale-detail/application/dtos/add-detail-to-sale.dto";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";

export interface RegisterSaleDtoCopy {
  readonly branchOfficeId: bigint;
  readonly customerId: bigint;
  readonly employeeId: bigint;
  readonly subTotalAmount: number;
  readonly discountAmount: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly status: SaleStatusEnum;
  readonly notes: string |null;
  readonly saleDetails?: AddDetailToSaleDto[] | null;
}
