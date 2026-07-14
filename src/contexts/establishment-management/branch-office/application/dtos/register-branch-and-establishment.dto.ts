export interface RegisterBranchAndEstablishmentDto {
  readonly name: string | null;
  readonly branchOfficeId: bigint;
  readonly establishmentId: bigint;
  readonly branchOfficeName: string;
  readonly establishmentName: string;
  readonly enrollmentKey: string;
}