import { CashRegisterResponseDTO } from "src/contexts/cash-management/cash-register/application/dtos/cash-register-response.dto";
import { EmployeeResponseDto } from "src/contexts/employee-management/employee/application/dtos/employee-response.dto";
import { TransactionResponseDTO } from "src/contexts/transaction-management/transaction/application/dtos/transaction.response.dto";

export class CashSessionResponseDTO {
    cashSessionId: bigint;
    cashRegisterId: bigint;
    employeeId: bigint;
    startTime: Date;
    startBalance: number;
    endTime: Date | null;
    expectedBalance: number | null;
    actualBalance: number | null;
    diference: number | null;
    isClosed: boolean;
    closingNotes: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    cashRegister: CashRegisterResponseDTO | null;
    employee: EmployeeResponseDto | null;
    transactions: TransactionResponseDTO[];
}