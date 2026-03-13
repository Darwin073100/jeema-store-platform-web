export class RegisterUserWithEmployeeDTO{
    readonly branchOfficeId: bigint;
    readonly username: string;
    readonly email: string;
    readonly passwordPlain: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber?: string|null;

    constructor(
        branchOfficeId: bigint,
        username: string,
        email: string,
        passwordHash: string,
        firstName: string,
        lastName: string,
        phoneNumber?: string|null,
    ){
        this.branchOfficeId = branchOfficeId;
        this.username = username;
        this.email = email;
        this.passwordPlain = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        Object.freeze(this);
    }
}