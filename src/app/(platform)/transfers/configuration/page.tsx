import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";

export default async function () {

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Traspasos', href: '/transfers'},
        {label: 'Configurar sucursal'}
    ]
    return (
        <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Configurar sucursal" detail="Realiza la configuración para que tu sucursal envíe y reciba traspasos de otras sucursale." breadcrumbItems={breadcrumbItems}>
                
            </TemplateHeader>
        </ProtectedRoute>
    );
}