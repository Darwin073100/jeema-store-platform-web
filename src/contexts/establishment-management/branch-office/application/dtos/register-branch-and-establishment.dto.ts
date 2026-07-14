export interface RegisterBranchAndEstablishmentDto {
  readonly branchOfficeId: bigint;
  readonly establishmentId: bigint;
  readonly branchOfficeName: string;
  readonly establishmentName: string;
  readonly enrollmentKey: string;
}