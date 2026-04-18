import { findSuplierByIdAction } from "@/contexts/purchase-management/suplier/presentation/actions/find-suplier-by-id.action"
import { ISuplier } from "@/contexts/purchase-management/suplier/presentation/interfaces/ISuplier"
import { SuplierAddress } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierAddress"
import { SuplierInformation } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierInformation"
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic"

interface Props {
    params: {
        branchOfficeId: string
    }
}

export const metadata = {
    title: 'Proveedor'
}
export default async function ({ params }: Props) {
    try {
        const { branchOfficeId } = await params;
        const suplier = (await findSuplierByIdAction(BigInt(branchOfficeId))).value as ISuplier | null;

        if (!suplier) {
            throw Error();
        }

        const breadCrumbItems = [
            { label: 'Configuración', href: '/configurations' },
            { label: 'Establecimiento', href: '/configurations/establishment' },
            { label: 'Sucursal' },
            { label: suplier.name },
        ]

        return (
            <ProtectedRoute>
                <TemplateHeader title={suplier.name} detail="Visualización de la información de la sucursal." breadcrumbItems={breadCrumbItems}>
                    <SuplierInformation 
                        suplier={suplier}/>
                    <SuplierAddress />                    
                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/configurations/establishment"
                    linkText="Volver a la vista general."
                    title="¡Oops! No pudimos encontrar esta sucursal"
                    description="La sucursal solicitada no existe en nuestra base de datos o no se pudo cargar en este momento." />
            </ProtectedRoute>
        )
    }
}