import { BranchOfficeMapper } from "src/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/mappers/branch-office.mapper";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashRegisterOrmEntity } from "../entities/cash-register.orm-entity";
import { CashSessionMapper } from "src/contexts/cash-management/cash-session/infraestructure/mappers/cash-session.mapper";

export class CashRegisterMapper {
    public static toDomain(ormEntity: CashRegisterOrmEntity){
        const domainEntity = CashRegisterEntity.reconstitute(
            ormEntity.cashRegisterId,
            ormEntity.branchOfficeId,
            ormEntity.name,
            ormEntity.isActive,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.deletedAt,
            ormEntity.branchOffice ? BranchOfficeMapper.toDomainEntity(ormEntity.branchOffice): null,
            ormEntity.cashSessions ? ormEntity.cashSessions.map(item => CashSessionMapper.toDomain(item)): null,
        );
        return domainEntity;
    }

    public static toOrm(domainEntity: CashRegisterEntity){
        const ormEntity: CashRegisterOrmEntity = {
            cashRegisterId: domainEntity.cashRegisterId,
            branchOfficeId: domainEntity.branchOfficeId,
            name: domainEntity.name,
            isActive: domainEntity.isActive,
            createdAt: domainEntity.createdAt,
            updatedAt: domainEntity.updatedAt,
            deletedAt: domainEntity.deletedAt,
            branchOffice: domainEntity.branchOffice? BranchOfficeMapper.toOrmEntity(domainEntity.branchOffice): null,
            cashSessions: domainEntity.cashSessions? domainEntity.cashSessions.map(item => CashSessionMapper.toOrm(item)): null,
        }
        return ormEntity;
    }
}