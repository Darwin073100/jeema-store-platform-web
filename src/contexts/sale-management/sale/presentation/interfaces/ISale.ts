import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { SaleStatusEnum } from "../../domain/enums/sale-status.enum";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { ICustomer } from "@/contexts/sale-management/customer/presentation/interfaces/ICustomer";
import { ISalePayment } from "@/contexts/sale-management/sale-payment/presentation/interfaces/ISalePayment";

export interface ISale {
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
    branchOffice: IBranchOffice | null,
    customer: ICustomer | null,
    employee: IEmployee | null,
    cashSession: ICashSession | null,
    saleDetails: ISaleDetail[],
    salePayments: ISalePayment[],
}
