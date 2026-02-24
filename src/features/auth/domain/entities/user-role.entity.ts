import { RoleEntity } from "./role.entity";
import { UserEntity } from "./user.entity";

export interface UserRoleEntity {
    userId: string;
    roleId: string;
    userRoleId: string;
    createdAt: Date;
    user: UserEntity | null;
    role: RoleEntity | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}