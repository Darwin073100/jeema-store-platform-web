import { findSuplierByIdAction } from "@/contexts/purchase-management/suplier/presentation/actions/find-suplier-by-id.action"
import { ISuplier } from "@/contexts/purchase-management/suplier/presentation/interfaces/ISuplier"
import { SuplierAddress } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierAddress"
import { SuplierInformation } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierInformation"
import { formatDate } from "@/shared/lib/utils/date-formatter"
import { Button } from "@/shared/ui/components/buttons"
import { CardGrid } from "@/shared/ui/components/grids/CardGrid"
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic"
import { IconBase } from "react-icons"
import { BiSolidPurchaseTag } from "react-icons/bi"
import { ImPacman } from "react-icons/im"
import { IoAddCircleSharp } from "react-icons/io5"
import { PiAddressBookFill, PiCactus } from "react-icons/pi"

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
                    linkHref="/purchases/supliers"
                    linkText="Volver a la lista de proveedores."
                    title="¡Oops! No pudimos encontrar este proveedor"
                    description="El proveedor solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
            </ProtectedRoute>
        )
    }
}