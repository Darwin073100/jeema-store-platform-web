'use client'
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth'
import React, { ReactNode } from 'react'

interface Props {
    roles?: string[],
    permissions?: string[],
    children?: ReactNode,
    requireAll?: boolean // Si es true, requiere tener TODOS los roles/permisos. Si es false, requiere tener AL MENOS UNO
}

const HideElement = ({ permissions, roles, children, requireAll = false }: Props) => {
    const { workspace } = useWorkspace();

    // Validar si el usuario tiene los roles requeridos
    const hasRequiredRoles = (): boolean => {
        // Si no se especifican roles, la validación de roles pasa
        if (!roles || roles.length === 0) {
            return true;
        }

        // Obtener los roles del usuario
        const userRoles = workspace?.user?.roles ?? [];

        // Si requireAll es true, el usuario debe tener TODOS los roles especificados
        if (requireAll) {
            return roles.every(requiredRole =>
                userRoles.some(userRole => 
                    userRole.toLowerCase() === requiredRole.toLowerCase()
                )
            );
        }

        // Si requireAll es false, el usuario debe tener AL MENOS UNO de los roles especificados
        return roles.some(requiredRole =>
            userRoles.some(userRole =>
                userRole.toLowerCase() === requiredRole.toLowerCase()
            )
        );
    };

    // Validar si el usuario tiene los permisos requeridos
    const hasRequiredPermissions = (): boolean => {
        // Si no se especifican permisos, la validación de permisos pasa
        if (!permissions || permissions.length === 0) {
            return true;
        }

        // Obtener los permisos del usuario
        const userPermissions = workspace?.user?.permissions ?? [];

        // Si requireAll es true, el usuario debe tener TODOS los permisos especificados
        if (requireAll) {
            return permissions.every(requiredPermission =>
                userPermissions.some(userPermission =>
                    userPermission.toLowerCase() === requiredPermission.toLowerCase()
                )
            );
        }

        // Si requireAll es false, el usuario debe tener AL MENOS UNO de los permisos especificados
        return permissions.some(requiredPermission =>
            userPermissions.some(userPermission =>
                userPermission.toLowerCase() === requiredPermission.toLowerCase()
            )
        );
    };

    // Mostrar el elemento solo si cumple con los roles Y permisos requeridos
    const shouldShow = hasRequiredRoles() && hasRequiredPermissions();

    // Si no cumple con los requisitos, no renderizar nada
    if (!shouldShow) {
        return null;
    }

    // Si cumple con los requisitos, renderizar los children
    return <>{children}</>;
};

export { HideElement };
