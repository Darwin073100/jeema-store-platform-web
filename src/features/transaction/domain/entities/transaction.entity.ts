import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { SaleEntity } from "@/features/sale/domain/entities/sale-entity";
import { TransactionTypeEntity } from "./transaction-type.entity";

export interface TransactionEntity {
    transactionId     : bigint;
    transactionTypeId : bigint;
    branchOfficeId    : bigint;
    purchaseId        : bigint | null;
    saleId            : bigint | null;
    employeeId        : bigint;
    amount            : number;
    description       : string | null;
    createdAt         : Date;
    updatedAt         : Date | null;
    deletedAt         : Date | null;
    transactionType   : TransactionTypeEntity | null;
    branchOffice      : BranchOfficeEntity | null;
    sale              : SaleEntity | null;
    employee          : EmployeeEntity | null;
}