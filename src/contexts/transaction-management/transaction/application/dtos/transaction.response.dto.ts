import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";
import { SaleResponseDto } from "src/contexts/sale-management/sale/application/dtos/sale-response.dto";
import { TransactionTypeResponseDTO } from "src/contexts/transaction-management/transaction-type/applications/dtos/transaction-type-response.dto";

export class TransactionResponseDTO {
    transactionId     : bigint;
    transactionTypeId : bigint;
    branchOfficeId    : bigint;
    purchaseId        : bigint | null;
    saleId            : bigint | null;
    employeeId        : bigint;
    cashSessionId     : bigint | null;
    amount            : number;
    description       : string | null;
    createdAt         : Date;
    updatedAt         : Date | null;
    deletedAt         : Date | null;
    transactionType   : TransactionTypeResponseDTO | null;
    branchOffice      : BranchOfficeResponseDto | null;
    sale              : SaleResponseDto | null;
    employee          : EmployeeResponseDto | null;
}