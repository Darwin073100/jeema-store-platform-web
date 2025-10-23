import { findAllEmployeeRolesAction } from "@/features/employee/actions/find-all-employee-roles.action";
import { EmployeeEnableOptios } from "@/features/employee/ui/register/EmployeeEnableOptios";
import { EmployeeForms } from "@/features/employee/ui/register/EmployeeForms";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nuevo empleado'
}

export default async function(){
    const rolesResult = await findAllEmployeeRolesAction();
    const employeeRoles = rolesResult.value?.employeeRoles.map(item=> ({
        text: item.name.toUpperCase(), 
        value:item.employeeRoleId.toString()
    })) ?? [];

    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Empleados', href: '/configurations/employees'},
        {label: 'Nuevo empleado'},
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title="Registra un nuevo empleado" detail="Podras dar de alta un nuevo empleado con o sin usuario para acceso al sistema." breadcrumbItems={breadCrumbItems}>
                <EmployeeForms 
                    optionsRoles={employeeRoles}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}