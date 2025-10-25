export interface RegisterUserDTO{
    employeeId: bigint,
    roleId: bigint,
    username: string,
    email: string,
    passwordHash: string,
}