import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"
import { TransfersOptions } from "@/contexts/inventory-management/transfer/presentation/ui/TransfersOptions";

export const metadata = {
    title: 'Traspasos|Opciones',
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Traspasos'},
    { label: 'Opciones' }
]

export default function () {
    return (
        <ProtectedRoute>
            <TemplateHeader title="Menu de opciones | Traspasos" detail="Opciones o acciones para traspaso entre sucursales." breadcrumbItems={breadcrumbItems}>
                <main className="flex flex-col gap-4 w-full">
                    <form className="flex max-md:flex-col gap-4 w-full text-gray-700">
                        <TransfersOptions />
                    </form>
                </main>
            </TemplateHeader>
        </ProtectedRoute>
    )
}