import { IRolePermission } from "@/contexts/authentication-management/role/presentation/interfaces/IRolePermission";

export interface IPermission {
    permissionId: bigint,
    name: string,
    description: string|null,
    rolePermissions: IRolePermission[],
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
}
