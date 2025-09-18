import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { BaseEntity } from "@/shared/features/base.entity";
import { SaleStatusEnum } from "../enums/sale-status.enum";

export interface SaleEntity extends BaseEntity {
    saleId: bigint;
    branchOfficeId: bigint;
    customerId: bigint;
    employeeId: bigint;
    subTotalAmount: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    status: SaleStatusEnum;
    notes: string |null;
    branchOffice?: BranchOfficeEntity | null;
    customer?: any | null;
    employee?: any | null;
    saleDetails?: any[] | [];
}