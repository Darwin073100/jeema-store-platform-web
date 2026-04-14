import { findSuplierByIdAction } from "@/contexts/purchase-management/suplier/presentation/actions/find-suplier-by-id.action"
import { ISuplier } from "@/contexts/purchase-management/suplier/presentation/interfaces/ISuplier"
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
    try {
        const { suplierId } = await params;
        const suplier = (await findSuplierByIdAction(BigInt(suplierId))).value as ISuplier | null;

        if (!suplier) {
            throw Error();
        }

        const breadCrumbItems = [
            { label: 'Compras', href: '/purchases' },
            { label: 'Proveedores', href: '/purchases/supliers' },
            { label: suplier.name },
        ]

        return (
            <ProtectedRoute>
                <TemplateHeader title={suplier.name} detail="Visualización de la informacion del proveedor." breadcrumbItems={breadCrumbItems}>

                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/purchases/supliers"
                    linkText="Volver a la lista de proveedores."
                    title="¡Oops! No pudimos encontrar este proveedor"
                    description="El proveedor solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
            </ProtectedRoute>
        )
    }
}