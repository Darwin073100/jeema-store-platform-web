export interface UpdateEmployeeDto {
  readonly branchOfficeId?: bigint;
  readonly employeeRoleId?: bigint;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string | null;
  readonly phoneNumber?: string;
  readonly birthDate?: string | null;
  readonly gender?: string | null;
  readonly hireDate?: string | null;
  readonly terminationDate?: string | null;
  readonly entryTime?: string | null;
  readonly exitTime?: string | null;
  readonly currentSalary?: number | null;
  readonly isActive?: boolean;
  readonly photoUrl?: string | null;
}