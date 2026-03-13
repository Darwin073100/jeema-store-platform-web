export class UpdateEmployeeDto {
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

  constructor(
    branchOfficeId?: bigint,
    employeeRoleId?: bigint,
    firstName?: string,
    lastName?: string,
    email?: string | null,
    phoneNumber?: string,
    birthDate?: string | null,
    gender?: string | null,
    hireDate?: string | null,
    terminationDate?: string | null,
    entryTime?: string | null,
    exitTime?: string | null,
    currentSalary?: number | null,
    isActive?: boolean,
    photoUrl?: string | null
  ) {
    this.branchOfficeId = branchOfficeId;
    this.employeeRoleId = employeeRoleId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
    this.gender = gender;
    this.hireDate = hireDate;
    this.terminationDate = terminationDate;
    this.entryTime = entryTime;
    this.exitTime = exitTime;
    this.currentSalary = currentSalary;
    this.isActive = isActive;
    this.photoUrl = photoUrl;
    Object.freeze(this); // Congela el objeto para hacerlo inmutable
  }
}