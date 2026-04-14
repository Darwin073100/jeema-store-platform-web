import { findSuplierByIdAction } from "@/contexts/purchase-management/suplier/presentation/actions/find-suplier-by-id.action"
import { ISuplier } from "@/contexts/purchase-management/suplier/presentation/interfaces/ISuplier"
import { formatDate } from "@/shared/lib/utils/date-formatter"
import { Button } from "@/shared/ui/components/buttons"
import { CardGrid } from "@/shared/ui/components/grids/CardGrid"
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic"
import { IconBase } from "react-icons"
import { ImPacman } from "react-icons/im"
import { IoAddCircleSharp } from "react-icons/io5"
import { PiCactus } from "react-icons/pi"

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
                    <div className="my-4 flex gap-2 items-center">
                        <IoAddCircleSharp />
                        <h2 className="text-lg font-bold">Proveedor</h2>
                        <Button size="sm">Editar</Button>
                        <Button size="sm">Eliminar</Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        <CardGrid title="Nombre" icon={<PiCactus/>}>
                            {suplier.name}
                        </CardGrid>
                        <CardGrid title="Persona" icon={<PiCactus/>}>
                            {suplier.contactPerson}
                        </CardGrid>
                        <CardGrid title="Correo" icon={<PiCactus/>}>
                            {suplier.email}
                        </CardGrid>
                        <CardGrid title="Teléfono" icon={<PiCactus/>}>
                            {suplier.phoneNumber}
                        </CardGrid>
                        <CardGrid title="RFC" icon={<PiCactus/>}>
                            {suplier.rfc}
                        </CardGrid>
                        <CardGrid title="Alta" icon={<PiCactus/>}>
                            {formatDate(suplier.createdAt)}
                        </CardGrid>
                        <CardGrid title="Edición" icon={<PiCactus/>}>
                            {formatDate(suplier.updatedAt)}
                        </CardGrid>
                    </div>
                    <CardGrid title="Notas" icon={<PiCactus/>}>
                        {suplier.notes}
                    </CardGrid>
                    <div className="my-4 flex gap-2 items-center">
                        <IoAddCircleSharp />
                        <h2 className="text-lg font-bold">Dirección</h2>
                        <Button size="sm">Editar</Button>
                        <Button size="sm">Agregar</Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        <CardGrid title="País" icon={<PiCactus/>}>
                            {suplier.address?.country}
                        </CardGrid>
                        <CardGrid title="Estado" icon={<PiCactus/>}>
                            {suplier.address?.state}
                        </CardGrid>
                        <CardGrid title="Municipio" icon={<PiCactus/>}>
                            {suplier.address?.municipality}
                        </CardGrid>
                        <CardGrid title="Código P." icon={<PiCactus/>}>
                            {suplier.address?.postalCode}
                        </CardGrid>
                        <CardGrid title="Ciudad" icon={<PiCactus/>}>
                            {suplier.address?.city}
                        </CardGrid>
                        <CardGrid title="Colonia" icon={<PiCactus/>}>
                            {suplier.address?.neighborhood}
                        </CardGrid>
                        <CardGrid title="Calle" icon={<PiCactus/>}>
                            {suplier.address?.street}
                        </CardGrid>
                        <CardGrid title="N. Interior" icon={<PiCactus/>}>
                            {suplier.address?.internalNumber}
                        </CardGrid>
                        <CardGrid title="N. Exterior" icon={<PiCactus/>}>
                            {suplier.address?.externalNumber}
                        </CardGrid>
                    </div>
                    <CardGrid title="Referencia" icon={<PiCactus/>}>
                        {suplier.address?.reference}
                    </CardGrid>
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