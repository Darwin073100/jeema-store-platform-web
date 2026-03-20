import { CustomerForms } from "@/contexts/sale-management/customer/presentation/ui/CustomerForms";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nuevo cliente'
}

export default async function(){

    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Clientes', href: '/customers'},
        {label: 'Nuevo cliente'},
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title="Registra un nuevo cliente" detail="Da de alta los clientes para las ventas." breadcrumbItems={breadCrumbItems}>
                <CustomerForms />
            </TemplateHeader>
        </ProtectedRoute>
    )
}