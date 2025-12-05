import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { AddressEntity } from "@/shared/domain/entities/address.entity";
import { BaseEntity } from "@/shared/features/base.entity";

export interface BranchOfficeEntity extends BaseEntity{
    branchOfficeId: bigint;
    establishmentId: bigint;
    name: string;
    address: AddressEntity;
    postalCode: string;
    street: string;
    internalNumber: string;
    externalNumber: string;
    neighborhood: string;
    municipality: string;
    country: string;
    city: string;
    state: string;
    reference?: string;
    employees: EmployeeEntity[]
}