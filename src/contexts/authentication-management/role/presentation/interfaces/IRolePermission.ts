import { IPermission } from "@/contexts/authentication-management/permission/presentation/interfaces/IPermission";

export interface IRolePermission {
    rolePermissionId: bigint;
    roleId: bigint,
    name: string,
    description: string | null,
    permission: IPermission,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}