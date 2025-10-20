import { findAllEmployeesByEstablishmentIdAction } from "@/features/employee/actions/find-all-employees-by-establishment-id.action";
import { EmployeeDesktopTable } from "@/features/employee/ui/details/EmployeeDesktopTable";
import { EmployeeOptios } from "@/features/employee/ui/details/EmployeeOptios";
import { Badge } from "@/ui/components/badges/Badge";
import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { IoPersonAdd } from "react-icons/io5";

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
        <ProtectedRoute>
            <TemplateHeader title="Empleados del establecimiento" detail="Lista de los empleados de este establecimeinto." breadcrumbItems={breadCrumbItems}>
                <EmployeeOptios/>
                <div>
                    <TextInput placeholder="Buscar por nombre de empleado"/>
                </div>
                <EmployeeDesktopTable 
                    employees={data}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}