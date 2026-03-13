export class AddRoleToUserDTO{
    readonly userId: bigint;
    readonly roleId: bigint;
    constructor(
        userId: bigint,
        roleId: bigint,
    ){
        this.userId = userId;
        this.roleId = roleId;
    }
}