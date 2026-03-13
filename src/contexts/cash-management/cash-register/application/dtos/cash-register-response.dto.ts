import { CashSessionResponseDTO } from "src/contexts/cash-management/cash-session/application/dtos/cash-session-response.dto";
import { BranchOfficeResponseDto } from "src/contexts/establishment-management/branch-office/application/dtos/branch-office-response.dto";

export class CashRegisterResponseDTO {
    cashRegisterId: bigint;
    branchOfficeId: bigint;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    branchOffice: BranchOfficeResponseDto | null;
    cashSessions: CashSessionResponseDTO[];
}