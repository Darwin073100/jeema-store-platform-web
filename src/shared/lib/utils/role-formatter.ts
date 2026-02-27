import { RoleEntity } from "@/features/auth/domain/entities/role.entity";
import { SelectMenuOption } from "@/shared/ui/components/inputs";

export const handleOptionsUserRoles = (roles: RoleEntity[]): SelectMenuOption[] => {
    const rolesOption = roles.map(item => {
        let options: SelectMenuOption = {
            value: '0',
            text: 'Rol no definido',
            additional: 'Rol no definido'
        }
        if (item.name.trim().toLowerCase() === 'global_admin'.trim().toLowerCase()) {
            options = {
                value: item.roleId,
                text: 'Administrador Global',
                additional: item.description ?? undefined
            }
        }
        if (item.name.trim().toLowerCase() === 'establishment_manager'.trim().toLowerCase()) {
            options = {
                value: item.roleId,
                text: 'Administrador de Establecimiento',
                additional: item.description ?? undefined
            }
        }
        if (item.name.trim().toLowerCase() === 'branch_office_management'.trim().toLowerCase()) {
            options = {
                value: item.roleId,
                text: 'Administrador de Sucursal',
                additional: item.description ?? undefined
            }
        }
        if (item.name.trim().toLowerCase() === 'cajero'.trim().toLowerCase()) {
            options = {
                value: item.roleId,
                text: 'Cajero',
                additional: item.description ?? undefined
            }
        }
        if (item.name.trim().toLowerCase() === 'seller'.trim().toLowerCase()) {
            options = {
                value: item.roleId,
                text: 'Vendedor',
                additional: item.description ?? undefined
            }
        }
        return options;
    });
    return rolesOption;
}

export const handleOptionUserRole = (rol: RoleEntity | null): SelectMenuOption => {
        let options: SelectMenuOption = {
            value: '0',
            text: 'Rol no definido',
            additional: 'Rol no definido'
        }
        if (rol && rol.name.trim().toLowerCase() === 'global_admin'.trim().toLowerCase()) {
            options = {
                value: rol.roleId,
                text: 'Administrador Global',
                additional: rol.description ?? undefined
            }
        }
        if (rol && rol.name.trim().toLowerCase() === 'establishment_manager'.trim().toLowerCase()) {
            options = {
                value: rol.roleId,
                text: 'Administrador de Establecimiento',
                additional: rol.description ?? undefined
            }
        }
        if (rol && rol.name.trim().toLowerCase() === 'branch_office_management'.trim().toLowerCase()) {
            options = {
                value: rol.roleId,
                text: 'Administrador de Sucursal',
                additional: rol.description ?? undefined
            }
        }
        if (rol && rol.name.trim().toLowerCase() === 'cajero'.trim().toLowerCase()) {
            options = {
                value: rol.roleId,
                text: 'Cajero',
                additional: rol.description ?? undefined
            }
        }
        if (rol && rol.name.trim().toLowerCase() === 'seller'.trim().toLowerCase()) {
            options = {
                value: rol.roleId,
                text: 'Vendedor',
                additional: rol.description ?? undefined
            }
        }
        return options;
}