import { IRole } from "@/contexts/authentication-management/role/presentation/interfaces/IRole";
import { IUser } from "./IUser";

export interface IUserRole {
    userRoleId: bigint;
    userId: bigint;
    roleId: bigint;
    createdAt: Date;
    user: IUser | null;
    role: IRole | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}