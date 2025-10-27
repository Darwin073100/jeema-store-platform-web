export interface RegisterUserHttpDTO{
    employeeId?: string | null,
    roleId: string,
    username: string,
    email: string,
    password: string,
}