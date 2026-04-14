import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic"

interface Props {
    params: {
        suplierId: string
    }
}

export const metadata = {
    title: 'Proveedor'
}
export default async function ({ params }: Props) {
    const { suplierId } = await params;
    try {
        const breadCrumbItems = [
            { label: 'Compras', href: '/purchases' },
            { label: 'Proveedores', href: '/purchases/supliers' },
            { label: 'Nuevo proveedor' },
        ]

        return (
            <ProtectedRoute>
                <TemplateHeader title="Registra un nuevo proveedor" detail="Da de alta los proveedores para ligarlos a lotes de compra." breadcrumbItems={breadCrumbItems}>

                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        <ProtectedRoute>
            <TemplateNotFoundDinamic
                linkHref="/purchases/supliers"
                linkText="Volver a la lista de proveedores."
                title="¡Oops! No pudimos encontrar este proveedor"
                description="El proveedor solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
        </ProtectedRoute>
    }
}