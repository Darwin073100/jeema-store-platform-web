export class UpdateUserDTO{
    readonly username?: string;
    readonly email?: string;
    readonly passwordPlain?: string;
    readonly isActive?: boolean;
    constructor(
        username?: string,
        email?: string,
        passwordPlain?: string,
        isActive?: boolean,
    ){
        this.username = username;
        this.email = email;
        this.passwordPlain = passwordPlain;
        this.isActive = isActive;
        Object.freeze(this);
    }
}