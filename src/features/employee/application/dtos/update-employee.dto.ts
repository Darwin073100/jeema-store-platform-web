export interface UpdateEmployeeDTO {
    branchOfficeId?: bigint,
    employeeRoleId?: bigint,
    firstName?: string,
    lastName?: string,
    email?: string | null,
    phoneNumber?: string,
    birthDate?: Date | null,
    gender?: string | null,
    hireDate?: Date | null,
    terminationDate?: Date | null,
    entryTime?: string | null,
    exitTime?: string | null,
    currentSalary?: number | null,
    isActive?: boolean,
    photoUrl?: string | null
}