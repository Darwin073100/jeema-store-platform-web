import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { IPrinterConfiguration } from "@/contexts/configuration-management/printer-configuration/presentation/interfaces/IPrinterConfiguration";

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
    printerConfiguration: IPrinterConfiguration | null;
}