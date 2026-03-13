export const PERMISSION_CHECKER_PORT = Symbol('PERMISSION_CHECKER_PORT');
export interface PermissionCheckerPort{
    check(permissionId: bigint): Promise<boolean>;
}