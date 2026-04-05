export interface UpdateUserDTO{
    readonly username?: string;
    readonly email?: string;
    readonly passwordPlain?: string;
    readonly isActive?: boolean;
}