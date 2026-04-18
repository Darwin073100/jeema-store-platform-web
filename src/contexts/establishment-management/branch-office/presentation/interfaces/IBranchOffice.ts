import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { IAddress } from "@/contexts/establishment-management/address/presentation/interfaces/IAddress";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";

export interface IBranchOffice {
    branchOfficeId: bigint;
    establishmentId: bigint;
    addressId: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    address: IAddress;
    establishment: IEstablishment | null;
    employees: IEmployee[];
    sales: ISale[];
}
