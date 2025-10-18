import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BasicTable } from "@/ui/components/tables/BasicTable";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Configurations'
}

export default function(){
    const heads = ['Folio', 'Empleado', 'Nom. de Usuario', 'Correo']
    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Usuarios'},
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Usuarios del sistema" detail="Lista de los usuarios de este establecimeinto." breadcrumbItems={breadCrumbItems}>
                <BasicTable theadList={heads} isActions={true}>
                    
                </BasicTable>
            </TemplateHeader>
        </ProtectedRoute>
    )
}