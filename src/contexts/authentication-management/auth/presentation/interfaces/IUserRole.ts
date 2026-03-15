import { IRole } from "@/contexts/authentication-management/role/presentation/interfaces/IRole";
import { IUser } from "./IUser";

export interface IUserRole {
    userId: string;
    roleId: string;
    userRoleId: string;
    createdAt: Date;
    user: IUser | null;
    role: IRole | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}