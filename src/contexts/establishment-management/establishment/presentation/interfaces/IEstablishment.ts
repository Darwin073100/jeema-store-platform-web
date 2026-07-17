import type { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";

export interface IEstablishment {
  establishmentId: bigint,
  cloudEstablishmentId: bigint | null,
  enrollmentKey: string | null,
  name: string,
  createdAt: Date,
  updatedAt: Date | null,
  deletedAt: Date | null,
  branchOffices: IBranchOffice[],
}