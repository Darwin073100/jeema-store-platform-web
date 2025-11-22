import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction.entity";
import { CashRegisterEntity } from "./cash-register.entity";

export interface CashSessionEntity {
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
    cashRegister: CashRegisterEntity | null;
    employee: EmployeeEntity | null;
    transactions: TransactionEntity[];
}