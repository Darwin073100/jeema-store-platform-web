export const ROLE_CHECKER_PORT = Symbol('ROLE_CHECKER_PORT');
export interface RoleCheckerPort{
    check(roleId: bigint): Promise<boolean>;
}