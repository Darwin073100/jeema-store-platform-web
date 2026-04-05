export interface RegisterUserWithEmployeeDTO{
    readonly branchOfficeId: bigint;
    readonly username: string;
    readonly email: string;
    readonly passwordPlain: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber?: string|null;
}