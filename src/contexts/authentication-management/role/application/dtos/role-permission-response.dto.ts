interface PermissionResponse{
    permissionId?: bigint;
    name?: string;
    description?: string | null,
    createdAt?: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export class RolePermissionResponseDTO{
    readonly roleId?: bigint;
    readonly name?: string;
    readonly description?: string | null;
    readonly permission?: PermissionResponse;
    readonly createdAt?: Date;
    readonly updatedAt?: Date | null;
    readonly deletedAt?: Date | null;
    constructor(
        roleId?: bigint,
        name?: string,
        description?: string | null,
        permission?: PermissionResponse,
        createdAt?: Date,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
    ){
        this.roleId = roleId;
        this.name = name;
        this.description = description;
        this.permission = permission;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        Object.freeze(this);
    }
}