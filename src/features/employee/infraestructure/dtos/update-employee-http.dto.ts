export interface UpdateEmployeeHttpDTO {
    branchOfficeId?: string,
    employeeRoleId?: string,
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
}