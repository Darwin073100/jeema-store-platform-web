import { Metadata } from "next";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { CreateCloudTransferForm } from "@/contexts/inventory-management/cloud-transfer/presentation/ui/CreateCloudTransferForm";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Traspasos|Nuevo'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Traspasos', href: '/transfers' },
    { label: 'Lista', href: '/transfers/list' },
    { label: 'Nuevo traspaso' }
]

export default function NewCloudTransferPage() {
    return (
        <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <TemplateHeader
                title="Nuevo traspaso a la nube"
                detail="Selecciona productos de tu inventario y la sucursal destino para enviar un traspaso."
                breadcrumbItems={breadcrumbItems}>
                <CreateCloudTransferForm />
            </TemplateHeader>
        </ProtectedRoute>
    )
}
