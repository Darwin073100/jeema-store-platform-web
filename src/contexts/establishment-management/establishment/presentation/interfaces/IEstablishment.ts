import type { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import type { IEstablishmentDetail } from "@/contexts/establishment-management/establishment-detail/presentation/interfaces/IEstablishmentDetail";

export interface IEstablishment {
  establishmentId: bigint,
  cloudEstablishmentId: bigint | null,
  enrollmentKey: string | null,
  name: string,
  logoUrl: string | null,
  createdAt: Date,
  updatedAt: Date | null,
  deletedAt: Date | null,
  branchOffices: IBranchOffice[],
  details: IEstablishmentDetail[],
}