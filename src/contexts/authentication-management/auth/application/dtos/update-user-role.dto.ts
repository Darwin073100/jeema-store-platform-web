export class UpdateUserRoleDTO{
    readonly userRoleId: bigint;
    readonly roleId: bigint;
    constructor(
        userRoleId: bigint,
        roleId: bigint,
    ){
        this.userRoleId = userRoleId;
        this.roleId = roleId;
    }
}