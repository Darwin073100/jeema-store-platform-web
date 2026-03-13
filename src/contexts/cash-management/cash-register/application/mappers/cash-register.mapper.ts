import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/application/mappers/branch-office.mapper";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashRegisterResponseDTO } from "../dtos/cash-register-response.dto";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/application/mappers/cash-session.mapper";

export class CashRegisterMapper {
    public static toResponse(entity: CashRegisterEntity): CashRegisterResponseDTO{
        const dto: CashRegisterResponseDTO = {
            cashRegisterId: entity.cashRegisterId,
            branchOfficeId: entity.branchOfficeId,
            name: entity.name,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
            branchOffice: entity.branchOffice? BranchOfficeMapper.toResponseDto(entity.branchOffice): null,
            cashSessions: entity.cashSessions? entity.cashSessions.map(item => CashSessionMapper.toResponseDto(item)): [],
        }
        return dto;
    }
}