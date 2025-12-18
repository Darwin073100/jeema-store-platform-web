import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { BaseEntity } from "@/shared/features/base.entity";
import { SaleStatusEnum } from "../enums/sale-status.enum";
import { SaleDetailEntity } from "./sale-detail-entity";
import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity";
import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { SalePaymentEntity } from "./sale-payment-entity";

export interface SaleEntity extends BaseEntity {
    saleId: bigint;
    branchOfficeId: bigint;
    customerId: bigint;
    employeeId: bigint;
    subTotalAmount: number;
    discountAmount: number;
    taxAmount: number;
    inAmount: number;
    outAmount: number;
    totalAmount: number;
    status: SaleStatusEnum;
    notes: string |null;
    branchOffice?: BranchOfficeEntity | null;
    customer?: CustomerEntity | null;
    employee?: EmployeeEntity | null;
    saleDetails?: SaleDetailEntity[] | [];
    salePayments?: SalePaymentEntity[]
}