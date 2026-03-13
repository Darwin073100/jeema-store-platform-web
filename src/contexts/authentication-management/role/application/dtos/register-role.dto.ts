export class RegisterRoleDto{
    readonly permissionId: bigint;
    readonly name: string;
    readonly description?: string|null;
    constructor(
        permissionId: bigint,
        name: string,
        description?: string|null
    ){
        this.permissionId = permissionId;
        this.name = name;
        this.description = description;
    }
}