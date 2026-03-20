import { findAllRoleAction } from "@/features/auth/actions/find-all-role.action";
import { findAllEmployeeRolesAction } from "@/contexts/employee-management/employee-role/presentation/actions/find-all-employee-roles.action";
import { EmployeeForms } from "@/contexts/employee-management/employee/presentation/ui/register/EmployeeForms";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nuevo empleado'
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
        {label: 'Empleados', href: '/configurations/employees'},
        {label: 'Nuevo empleado'},
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title="Registra un nuevo empleado" detail="Podras dar de alta un nuevo empleado con o sin usuario para acceso al sistema." breadcrumbItems={breadCrumbItems}>
                <EmployeeForms
                    userRoles={userRoles}
                    optionsRoles={employeeRoles}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}