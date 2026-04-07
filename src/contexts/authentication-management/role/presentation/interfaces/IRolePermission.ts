import { IPermission } from "@/contexts/authentication-management/permission/presentation/interfaces/IPermission";
import { IRole } from "./IRole";

export interface IRolePermission {
    rolePermissionId: bigint;
    roleId: bigint;
    permissionId: bigint;
    permission: IPermission | null;
    role: IRole | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}