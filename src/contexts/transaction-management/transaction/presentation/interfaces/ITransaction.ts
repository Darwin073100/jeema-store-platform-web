import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";
import { ITransactionType } from "@/contexts/transaction-management/transaction-type/presentation/interfaces/TransactionType";

export interface ITransaction {
    transactionId: bigint;
    transactionTypeId: bigint;
    branchOfficeId: bigint;
    purchaseId: bigint | null;
    saleId: bigint | null;
    employeeId: bigint;
    cashSessionId: bigint | null;
    amount: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    transactionType: ITransactionType | null;
    branchOffice: IBranchOffice | null;
    sale: ISale | null;
    employee: IEmployee | null;
}