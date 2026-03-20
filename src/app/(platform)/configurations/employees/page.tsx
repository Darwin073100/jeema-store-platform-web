import { findAllEmployeesByEstablishmentIdAction } from "@/contexts/employee-management/employee/presentation/actions/find-all-employees-by-establishment-id.action";
import { EmployeeDesktopTable } from "@/contexts/employee-management/employee/presentation/ui/details/EmployeeDesktopTable";
import { EmployeeOptios } from "@/contexts/employee-management/employee/presentation/ui/details/EmployeeOptios";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Empleados'
}

export default async function(){
    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Empleados'},
    ]
    const userResponse = await findAllEmployeesByEstablishmentIdAction();
    const data = userResponse?.value?.employees ?? [];

    return (
        <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Empleados del establecimiento" detail="Lista de los empleados de este establecimeinto." breadcrumbItems={breadCrumbItems}>
                <EmployeeOptios
                    employeesNo={data.length}/>
                <EmployeeDesktopTable 
                    employees={data}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}