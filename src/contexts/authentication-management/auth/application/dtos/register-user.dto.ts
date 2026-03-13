export class RegisterUserDTO{
    readonly employeeId: bigint;
    readonly roleId: bigint;
    readonly username: string;
    readonly email: string;
    readonly passwordPlain: string;
    constructor(
        employeeId: bigint,
        roleId: bigint,
        username: string,
        email: string,
        passwordHash: string,
    ){
        this.employeeId = employeeId;
        this.roleId = roleId;
        this.username = username;
        this.email = email;
        this.passwordPlain = passwordHash;
        Object.freeze(this);
    }
}