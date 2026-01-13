import { SuplierForms } from "@/features/suplier/presentation/ui/SuplierForms";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nuevo cliente'
}

export default async function(){

    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Productos', href: '/products'},
        {label: 'Proveedores', href: '/products/supliers'},
        {label: 'Nuevo proveedor'},
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title="Registra un nuevo proveedor" detail="Da de alta los proveedores para ligarlos a lotes de compra." breadcrumbItems={breadCrumbItems}>
                <SuplierForms />
            </TemplateHeader>
        </ProtectedRoute>
    )
}