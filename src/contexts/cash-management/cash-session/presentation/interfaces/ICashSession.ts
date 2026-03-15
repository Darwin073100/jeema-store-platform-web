import { ICashRegister } from "@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";

export interface ICashSession {
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
    cashRegister: ICashRegister | null;
    employee: IEmployee | null;
    transactions: any[];
}