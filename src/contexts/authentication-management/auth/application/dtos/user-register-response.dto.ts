interface RoleResponse{
    roleId?: bigint;
    name?: string;
    description?: string | null,
    createdAt?: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export class UserRegisterResponseDTO{
    readonly userId?: bigint;
    readonly employeeId?: bigint;
    readonly username?: string;
    readonly email?: string;
    readonly role?: RoleResponse;
    readonly isActive?: boolean;
    readonly lastLogin?: Date | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date | null;
    readonly deletedAt?: Date | null;
    constructor(
        userId?: bigint,
        employeeId?: bigint,
        username?: string,
        email?: string,
        role?: RoleResponse,
        isActive?: boolean,
        createdAt?: Date,
        lastLogin?: Date | null,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
    ){
        this.userId = userId;
        this.employeeId = employeeId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        Object.freeze(this);
    }
}