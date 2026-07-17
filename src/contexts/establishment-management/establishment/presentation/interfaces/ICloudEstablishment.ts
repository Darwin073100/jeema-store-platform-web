import type { ICloudBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/ICloudBranchOffice";

export interface ICloudEstablishment {
  cloudEstablishmentId: string,
  name: string,
  enrollmentKey: string,
  createdAt: Date,
  updatedAt: Date | null,
  deletedAt: Date | null,
  cloudBranchOffices: ICloudBranchOffice[],
}