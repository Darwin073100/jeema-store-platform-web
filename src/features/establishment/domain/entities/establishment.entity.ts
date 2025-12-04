import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { BaseEntity } from "@/shared/features/base.entity"

export interface EstablishmentEntity extends BaseEntity{
        establishmentId: bigint;
        name: string;
        branchOffices: BranchOfficeEntity[]
} 