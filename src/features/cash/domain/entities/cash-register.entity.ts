import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { CashSessionEntity } from "./cash-session.entity";

export interface CashRegisterEntity {
    cashRegisterId: bigint;
    branchOfficeId: bigint;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    branchOffice: BranchOfficeEntity | null;
    cashSessions: CashSessionEntity[];
}