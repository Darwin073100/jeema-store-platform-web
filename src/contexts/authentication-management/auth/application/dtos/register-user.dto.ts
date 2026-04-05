export interface RegisterUserDTO{
    readonly employeeId: bigint;
    readonly roleId: bigint;
    readonly username: string;
    readonly email: string;
    readonly passwordPlain: string;
}