import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";

export interface IEstablishment {
  establishmentId: string,
  name: string,
  createdAt: Date,
  updatedAt: Date | null,
  deletedAt: Date | null,
  branchOffices: IBranchOffice[],
}