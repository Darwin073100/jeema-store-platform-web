import { UserRoleEntity } from "../entities/user-role.entity";

export const USER_ROLE_REPOSITORY = Symbol('USER_ROLE_REPOSITORY');

export interface UserRoleRepository{
    save(entity: UserRoleEntity):Promise<UserRoleEntity>;
    findUserRoles(userId: bigint): Promise<UserRoleEntity[]>;
    saveSecondImpl(entity: UserRoleEntity):Promise<UserRoleEntity>;
    saveTwo(entity: UserRoleEntity):Promise<UserRoleEntity>;
    existById(userRoleId: bigint):Promise<UserRoleEntity|null>;
    existByRole(userId: bigint, roleId):Promise<UserRoleEntity|null>;
    update(entity: UserRoleEntity):Promise<UserRoleEntity>;
}