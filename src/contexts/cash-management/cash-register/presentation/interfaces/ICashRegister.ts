import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";

export interface ICashRegister {
    cashRegisterId: bigint;
    branchOfficeId: bigint;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    branchOffice: IBranchOffice | null;
    cashSessions: ICashSession[];
}