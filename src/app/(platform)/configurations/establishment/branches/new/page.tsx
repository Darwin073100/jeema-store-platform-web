import { findAllRoleAction } from "@/features/auth/actions/find-all-role.action";
import { findAllEmployeeRolesAction } from "@/features/employee/actions/find-all-employee-roles.action";
import { EmployeeForms } from "@/features/employee/ui/register/EmployeeForms";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nueva Sucursal'
}

export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export default async function(){
    const employeeRolesResult = await findAllEmployeeRolesAction();
    const employeeRoles = employeeRolesResult.value?.employeeRoles.map(item=> ({
        text: item.name.toUpperCase(), 
        value:item.employeeRoleId.toString()
    })) ?? [];

    const userRolesResult = await findAllRoleAction();
    const userRoles = userRolesResult.value?.roles ?? [];

    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Establecimiento', href: '/configurations/establishment'},
        {label: 'Nueva Sucursal'},
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title="Registra una nueva sucursal" detail="Podras dar de alta una nueva sucursal y administrar tu inventario entre ellas." breadcrumbItems={breadCrumbItems}>
                <EmployeeForms
                    userRoles={userRoles}
                    optionsRoles={employeeRoles}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}