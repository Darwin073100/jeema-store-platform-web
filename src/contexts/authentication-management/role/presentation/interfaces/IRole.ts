import { IUserRole } from "@/contexts/authentication-management/auth/presentation/interfaces/IUserRole";
import { IRolePermission } from "./IRolePermission";

export interface IRole {
    roleId: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    description: string|null;
    rolePermissions: IRolePermission[];
    userRoles: IUserRole[];
}
