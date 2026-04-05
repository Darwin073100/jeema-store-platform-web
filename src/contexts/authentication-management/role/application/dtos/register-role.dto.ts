export interface RegisterRoleDto{
    readonly permissionId: bigint;
    readonly name: string;
    readonly description?: string|null;
}