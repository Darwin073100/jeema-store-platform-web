import { Metadata } from "next";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { CloudTransfersList } from "@/contexts/inventory-management/cloud-transfer/presentation/ui/CloudTransfersList";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Traspasos|Lista'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Traspasos', href: '/transfers' },
    { label: 'Lista' }
]

export default function CloudTransfersListPage() {
    return (
        <ProtectedRoute>
            <TemplateHeader
                title="Traspasos a la nube"
                detail="Traspasos de mercancía enviados y recibidos entre sucursales a través de la nube (JEEMA Transfer)."
                breadcrumbItems={breadcrumbItems}>
                <CloudTransfersList />
            </TemplateHeader>
        </ProtectedRoute>
    )
}
